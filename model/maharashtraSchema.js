// import mongoose from 'mongoose';

// const maharashtraVendorSchema = new mongoose.Schema({
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
//   // categories: String,
//   foodItems: [String],
//   hygieneRating: String,
//   tasteRating: String,
//   hospitalityRating: String,
//   photoUrl: String,
// });

//  maharashtraVendorSchema.index({ location: '2dsphere' });

// const MaharashtraVendor = mongoose.model('MaharashtraVendor', maharashtraVendorSchema);
// export default MaharashtraVendor;


import mongoose from 'mongoose';

const maharashtraVendorSchema = new mongoose.Schema({
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
    default: 'Maharashtra',
    trim: true,
  },
  foodItems: {
    type: [String],
    default: [],
  },
  hygieneRating: {
    type: String, // remains as string
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

maharashtraVendorSchema.index({ location: '2dsphere' });
maharashtraVendorSchema.index({ city: 1 });
maharashtraVendorSchema.index({ state: 1 });
maharashtraVendorSchema.index({ hygieneRating: 1 });
maharashtraVendorSchema.index({ tasteRating: 1 });
maharashtraVendorSchema.index({ hospitalityRating: 1 });

const MaharashtraVendor = mongoose.model('MaharashtraVendor', maharashtraVendorSchema);
export default MaharashtraVendor;
