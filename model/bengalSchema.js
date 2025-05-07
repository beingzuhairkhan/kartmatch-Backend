// import mongoose from 'mongoose';

// const bengalVendorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: {
//       type: String,
//       enum: ['Point'],
//       default: 'Point',
//     },
//     coordinates: {
//       type: [Number], // [longitude, latitude]
//       required: true,
//     },
//   },
//   city: String,
//   state: String,
//   foodItems: [String],
//   hygieneRating: String,
//   tasteRating: String,
//   hospitalityRating: String,
//   photoUrl: String,
// });

//  bengalVendorSchema.index({ location: '2dsphere' });
// //bengalVendorSchema.index({ "location.coordinates": "2dsphere" });

// const BengalVendor = mongoose.model('BengalVendor', bengalVendorSchema);
// export default BengalVendor;


import mongoose from 'mongoose';

const bengalVendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    default: 'West Bengal',
    trim: true,
  },
  foodItems: {
    type: [String],
    default: [],
  },
  hygieneRating: {
    type: String,
    trim: true,
  },
  tasteRating: {
    type: String,
    trim: true,
  },
  hospitalityRating: {
    type: String,
    trim: true,
  },
  photoUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// ✅ Geo & Filter Indexes
bengalVendorSchema.index({ location: '2dsphere' });
bengalVendorSchema.index({ city: 1 });
bengalVendorSchema.index({ state: 1 });
bengalVendorSchema.index({ hygieneRating: 1 });
bengalVendorSchema.index({ tasteRating: 1 });
bengalVendorSchema.index({ hospitalityRating: 1 });

const BengalVendor = mongoose.model('BengalVendor', bengalVendorSchema);
export default BengalVendor;
