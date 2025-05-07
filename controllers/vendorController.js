import BengalVendor from '../model/bengalSchema.js';
import maharashtraVendor from '../model/maharashtraSchema.js';
import rajasthanVendor from '../model/rajasthanSchema.js';
import NodeCache from 'node-cache';

const vendorCache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });


const parseCoordinate = (coordinateStr) => {
  if (!coordinateStr || typeof coordinateStr !== 'string') return null;

  const cleanedStr = coordinateStr.trim().replace(/\s+/g, '');

  // Match decimal format with direction (e.g., "19.2836N")
  const decimalMatch = cleanedStr.match(/^([\d.]+)[°*"']?([NSWE])$/i);
  if (decimalMatch) {
    let value = parseFloat(decimalMatch[1]);
    const direction = decimalMatch[2].toUpperCase();
    if (['S', 'W'].includes(direction)) value *= -1;
    return Math.round(value * 1e5) / 1e5;
  }

  // Match DMS format like 26*15'44"N or 26°15′44″N
  const dmsMatch = cleanedStr.match(/^(\d+)[°*](\d+)[′'](\d+)[″"]?([NSWE])$/i);
  if (dmsMatch) {
    const degrees = parseInt(dmsMatch[1]);
    const minutes = parseInt(dmsMatch[2]);
    const seconds = parseInt(dmsMatch[3]);
    const direction = dmsMatch[4].toUpperCase();

    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (['S', 'W'].includes(direction)) decimal *= -1;
    return Math.round(decimal * 1e5) / 1e5;
  }

  // Fallback: parse as raw float
  const plain = parseFloat(coordinateStr);
  return isNaN(plain) ? null : Math.round(plain * 1e5) / 1e5;
};

// GeoJSON format is [longitude, latitude]
const toCoordinates = (latStr, lngStr) => {
  const lat = parseCoordinate(latStr);
  const lng = parseCoordinate(lngStr);
  return [lng, lat];
};

export const insertVendors = async (req, res) => {
  try {
    const vendors = req.body;

    const validVendors = vendors
      .map((vendor) => {
        const [longitude, latitude] = toCoordinates(vendor.latitude, vendor.longitude);

        if (longitude === null || latitude === null) {
          console.log('Invalid coordinates for vendor:', vendor.name);
          return null;
        }

        const hygieneRating = isNaN(vendor.hygiene) ? vendor.hygiene : parseFloat(vendor.hygiene);
        const tasteRating = isNaN(vendor.taste) ? vendor.taste : parseFloat(vendor.taste);
        const hospitalityRating = isNaN(vendor.hospitality)
          ? vendor.hospitality
          : parseFloat(vendor.hospitality);

        return {
          name: vendor.name,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          city: vendor.city || vendor.City,
          state: vendor.state || vendor.State,
          categories: vendor.categories || vendor.Categories,
          foodItems: vendor.foodItems
            ? Array.isArray(vendor.foodItems)
              ? vendor.foodItems
              : vendor.foodItems.split(',').map((item) => item.trim())
            : [],
            hygieneRating: vendor.hygiene || vendor.hygieneRating,
            tasteRating: vendor.taste || vendor.tasteRating,
            hospitalityRating: vendor.hospitality || vendor.hospitalityRating,
            photoUrl: vendor.photoUrl,
        };
      })
      .filter(Boolean);

    if (validVendors.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid vendors found with valid coordinates.',
      });
    }

    const inserted = await BengalVendor.insertMany(validVendors);

    res.status(201).json({
      success: true,
      message: 'Vendors inserted successfully',
      data: inserted,
    });
  } catch (error) {
    console.error('Insertion failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Insertion failed',
      error: error.message,
    });
  }
};




// export const fetchVendorsData = async (req , res)=>{
//   try{
//     const page = parseInt(req.query.page) || 1 ;
//     const limit = 9 ;
//     const startIndex = (page - 1) * limit ;

//     const bengalVendors = await BengalVendor.aggregate([
//       {$addFields : {state: 'West Bengal'}}
//     ]);

//     const maharashtraVendors = await maharashtraVendor.aggregate([
//       {$addFields : {state: 'Maharashtra'}}
//     ])

//     const rajasthanVendors = await rajasthanVendor.aggregate([
//       { $addFields: { state: 'Rajasthan' } }
//     ]); 

//     const allVendors = [
//       ...bengalVendors ,
//       ...maharashtraVendors,
//       ...rajasthanVendors
//     ]

//     // sort the data using name
//     allVendors.sort((a , b) => a.name.localeCompare(b.name))

//     //apply pagination
//     const paginatedVendors = allVendors.slice(startIndex , startIndex+limit);

//     res.status(200).json({
//       success: true,
//       currentPage: page,
//       totalPages: Math.ceil(allVendors.length / limit),
//       totalVendors: allVendors.length,
//       data: paginatedVendors
//     })


//   }catch(err){
//     console.log("Error in fetchingVendorsData" , err)
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// }

export const fetchVendorsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const startIndex = (page - 1) * limit;

    const cacheKey = `vendors:page:${page}`;

    // Try getting data from cache
    const cachedData = vendorCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: cachedData.totalPages,
        totalVendors: cachedData.totalVendors,
        data: cachedData.data,
        fromCache: true
      });
    }

    const [bengalVendors, maharashtraVendors, rajasthanVendors] = await Promise.all([
      BengalVendor.aggregate([
        { $addFields: { state: 'West Bengal' } },
        { $sort: { name: 1 } },
      ]),
      maharashtraVendor.aggregate([
        { $addFields: { state: 'Maharashtra' } },
        { $sort: { name: 1 } },
      ]),
      rajasthanVendor.aggregate([
        { $addFields: { state: 'Rajasthan' } },
        { $sort: { name: 1 } },
      ])
    ]);

    const allVendors = [
      ...bengalVendors,
      ...maharashtraVendors,
      ...rajasthanVendors
    ];

    const totalVendors = allVendors.length;
    const totalPages = Math.ceil(totalVendors / limit);

    const paginatedVendors = allVendors.slice(startIndex, startIndex + limit);

    // Cache the paginated result
    vendorCache.set(cacheKey, {
      totalPages,
      totalVendors,
      data: paginatedVendors,
    });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalVendors,
      data: paginatedVendors,
      fromCache: false
    });
  } catch (err) {
    console.log("Error in fetchingVendorsData", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// fetch vendors data 


export const getNearbyVendors = async (req, res) => {
  try {
    const { lat, lng, radius = '5' } = req.query;

    // Validation: Check presence
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and Longitude are required in the query parameters.',
      });
    }

    // Parse and validate inputs
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius); 

    if ([latitude, longitude, searchRadius].some(val => isNaN(val))) {
      return res.status(400).json({
        success: false,
        message: 'Latitude, Longitude, and Radius must be valid numbers.',
      });
    }

    const maxDistance = Math.round(searchRadius * 1000); 

    const cacheKey = `nearby-${latitude.toFixed(4)}-${longitude.toFixed(4)}-${maxDistance}`;
    const cachedResult = vendorCache.get(cacheKey);

    if (cachedResult) {
      return res.status(200).json({
        success: true,
        cached: true,
        totalResults: cachedResult.length,
        data: cachedResult,
      });
    }

    const fetchNearbyVendors = (Model) =>
      Model.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: maxDistance,
          },
        },
      });

    const [bengalVendors, maharashtraVendors, rajasthanVendors] = await Promise.all([
      fetchNearbyVendors(BengalVendor),
      fetchNearbyVendors(maharashtraVendor),
      fetchNearbyVendors(rajasthanVendor),
    ]);

    const combinedVendors = [
      ...bengalVendors.map(v => ({ ...v.toObject(), state: 'West Bengal' })),
      ...maharashtraVendors.map(v => ({ ...v.toObject(), state: 'Maharashtra' })),
      ...rajasthanVendors.map(v => ({ ...v.toObject(), state: 'Rajasthan' })),
    ];

    const formattedVendors = combinedVendors.map(v => ({
      ...v,
      latitude: v.location?.coordinates?.[1],
      longitude: v.location?.coordinates?.[0],
    }));

    vendorCache.set(cacheKey, formattedVendors);

    res.status(200).json({
      success: true,
      cached: false,
      totalResults: formattedVendors.length,
      data: formattedVendors,
    });

  } catch (error) {
    console.error('Nearby vendor fetch failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching nearby vendors.',
      error: error.message,
    });
  }
};



export const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params; // Getting vendor ID from request params

    // First, check if the vendor ID exists
    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required.' });
    }

    // Assuming you're querying multiple vendor collections (Bengal, Maharashtra, Rajasthan)
    const vendorData = await Promise.all([
      BengalVendor.findById(vendorId),
      maharashtraVendor.findById(vendorId),
      rajasthanVendor.findById(vendorId),
    ]);

    // Filter out null results (if vendor not found in any of the collections)
    const vendor = vendorData.find(v => v !== null);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    // Return vendor details
    res.status(200).json({
      success: true,
      data: vendor,
    });

  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};


export const getFilteredVendors = async (req, res) => {
  try {
    const { preferences, minStars = 5 } = req.body;

    if (!preferences || preferences.length === 0) {
      return res.status(400).json({ success: false, message: "No preferences provided." });
    }

    // Map from frontend filter names to database field names
    const preferenceToField = {
      Taste: "tasteRating",
      Hygiene: "hygieneRating",
      Hospitality: "hospitalityRating",
    };

    // Create dynamic MongoDB filter
    const filter = {};
    preferences.forEach((pref) => {
      const field = preferenceToField[pref];
      if (field) {
        // Rating is stored like "3 star", so build query accordingly
        filter[field] = { $regex: new RegExp(`^(${minStars}|[${minStars}-5]) star$`, "i") };
      }
    });

    // Create a cache key based on preferences and minStars
    const cacheKey = `filtered-${JSON.stringify(preferences)}-minStars-${minStars}`;

    // Check cache for filtered vendors
    const cachedVendors = vendorCache.get(cacheKey);

    if (cachedVendors) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedVendors,
      });
    }

    // Query all vendor collections in parallel
    const [bengal, maharashtra, rajasthan] = await Promise.all([
      BengalVendor.find(filter),
      maharashtraVendor.find(filter),
      rajasthanVendor.find(filter),
    ]);

    const allVendors = [
      ...bengal.map(v => ({ ...v._doc, state: "West Bengal" })),
      ...maharashtra.map(v => ({ ...v._doc, state: "Maharashtra" })),
      ...rajasthan.map(v => ({ ...v._doc, state: "Rajasthan" })),
    ];

    // Cache the filtered vendors for future use
    vendorCache.set(cacheKey, allVendors);

    res.json({ success: true, data: allVendors });

  } catch (error) {
    console.error('Error fetching filtered vendors:', error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const fixRajasthanCoordinates = async (req, res) => {
  try {
    const result = await rajasthanVendor.updateMany(
      {},
      [
        {
          $set: {
            'location.coordinates': {
              $reverseArray: '$location.coordinates',
            },
          },
        },
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Coordinates reversed for all Rajasthan vendors.',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error fixing coordinates:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};




// export const insertVendors = async (req, res) => {
//   try {
//     const vendors = req.body;

//     // Convert foodItems string to array (if needed) and ensure coordinates are valid numbers
//     const formattedVendors = vendors.map(vendor => ({
//       name: vendor.name,
//       location: {
//         type: "Point",
//         coordinates: [
//           parseFloat(vendor.longitude), // longitude
//           parseFloat(vendor.latitude),  // latitude
//         ],
//       },
//       city: vendor.city || vendor.City,
//       state: vendor.state || vendor.State,
//       foodItems: vendor.foodItems
//         ? Array.isArray(vendor.foodItems)
//           ? vendor.foodItems
//           : vendor.foodItems.split(',').map(item => item.trim())
//         : [],
//       hygieneRating: vendor.hygiene || vendor.hygieneRating,
//       tasteRating: vendor.taste || vendor.tasteRating,
//       hospitalityRating: vendor.hospitality || vendor.hospitalityRating,
//       photoUrl: vendor.photoUrl,
//     }));

//     const inserted = await maharashtraVendor.insertMany(formattedVendors);

//     res.status(201).json({
//       success: true,
//       message: 'Vendors inserted successfully',
//       data: inserted,
//     });
//   } catch (error) {
//     console.error('Insertion failed:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Insertion failed',
//       error: error.message,
//     });
//   }
// };
