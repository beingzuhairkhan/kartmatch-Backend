import BengalVendor from '../model/bengalSchema.js'
import maharashtraVendor from '../model/maharashtraSchema.js'
import rajasthanVendor from '../model/rajasthanSchema.js'

// INSERT MULTIPLE VENDORS
export const insertVendors = async (req, res) => {
  try {
    const vendors = req.body;

    // Convert foodItems string to array (if needed) and ensure coordinates are valid numbers
    const formattedVendors = vendors.map(vendor => ({
      name: vendor.name,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(vendor.longitude), // longitude
          parseFloat(vendor.latitude),  // latitude
        ],
      },
      city: vendor.city || vendor.City,
      state: vendor.state || vendor.State,
      foodItems: vendor.foodItems
        ? Array.isArray(vendor.foodItems)
          ? vendor.foodItems
          : vendor.foodItems.split(',').map(item => item.trim())
        : [],
      hygieneRating: vendor.hygiene || vendor.hygieneRating,
      tasteRating: vendor.taste || vendor.tasteRating,
      hospitalityRating: vendor.hospitality || vendor.hospitalityRating,
      photoUrl: vendor.photoUrl,
    }));

    const inserted = await rajasthanVendor.insertMany(formattedVendors);

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

export const fetchVendorsData = async (req , res)=>{
  try{
    const page = parseInt(req.query.page) || 1 ;
    const limit = 9 ;
    const startIndex = (page - 1) * limit ;

    const bengalVendors = await BengalVendor.aggregate([
      {$addFields : {state: 'West Bengal'}}
    ]);

    const maharashtraVendors = await maharashtraVendor.aggregate([
      {$addFields : {state: 'Maharashtra'}}
    ])

    const rajasthanVendors = await rajasthanVendor.aggregate([
      { $addFields: { state: 'Rajasthan' } }
    ]); 

    const allVendors = [
      ...bengalVendors ,
      ...maharashtraVendors,
      ...rajasthanVendors
    ]

    // sort the data using name
    allVendors.sort((a , b) => a.name.localeCompare(b.name))

    //apply pagination
    const paginatedVendors = allVendors.slice(startIndex , startIndex+limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(allVendors.length / limit),
      totalVendors: allVendors.length,
      data: paginatedVendors
    })


  }catch(err){
    console.log("Error in fetchingVendorsData" , err)
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// fetch vendors data 

export const getNearbyVendors = async (req, res) => {

  try{
    const { lat, lng, radius = 5 }  = req.query
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }

    const userCoordinates = [parseFloat(lng), parseFloat(lat)];
    const maxDistanceInMeters = parseFloat(radius) * 1000; // Convert km to meters

    // Common geoNear pipeline
    const geoNearPipeline = (stateName) => ([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: userCoordinates },
          distanceField: 'distance',
          maxDistance: maxDistanceInMeters,
          spherical: true,
        },
      },
      {
        $addFields: {
          state: stateName,
        },
      },
    ]);
    const [bengal, maharashtra, rajasthan] = await Promise.all([
      BengalVendor.aggregate(geoNearPipeline('West Bengal')),
      maharashtraVendor.aggregate(geoNearPipeline('Maharashtra')),
      rajasthanVendor.aggregate(geoNearPipeline('Rajasthan')),
    ]);
    const allNearby = [...bengal, ...maharashtra, ...rajasthan];
    allNearby.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      totalResults: allNearby.length,
      data: allNearby,
    });

  }catch(error){
    console.error('Nearby vendor fetch failed:', error);
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
}