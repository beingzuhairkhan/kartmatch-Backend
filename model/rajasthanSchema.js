// import mongoose from 'mongoose';

// const rajasthanVendorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     // required: true,
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

//  rajasthanVendorSchema.index({ location: '2dsphere' });
// //rajasthanVendorSchema.index({ "location.coordinates": "2dsphere" });

// const RajasthanVendor = mongoose.model('RajasthanVendor', rajasthanVendorSchema);
// export default RajasthanVendor;


import mongoose from 'mongoose';

const rajasthanVendorSchema = new mongoose.Schema({
  name: {
    type: String,
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
    default: 'Rajasthan',
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

// ✅ Performance Indexes
rajasthanVendorSchema.index({ location: '2dsphere' });
rajasthanVendorSchema.index({ city: 1 });
rajasthanVendorSchema.index({ state: 1 });
rajasthanVendorSchema.index({ hygieneRating: 1 });
rajasthanVendorSchema.index({ tasteRating: 1 });
rajasthanVendorSchema.index({ hospitalityRating: 1 });

const RajasthanVendor = mongoose.model('RajasthanVendor', rajasthanVendorSchema);
export default RajasthanVendor;
