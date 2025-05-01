import mongoose from 'mongoose';

const maharashtraVendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  city: String,
  state: String,
  // categories: String,
  foodItems: [String],
  hygieneRating: String,
  tasteRating: String,
  hospitalityRating: String,
  photoUrl: String,
});

 maharashtraVendorSchema.index({ location: '2dsphere' });
//maharashtraVendorSchema.index({ "location.coordinates": "2dsphere" });

const MaharashtraVendor = mongoose.model('MaharashtraVendor', maharashtraVendorSchema);
export default MaharashtraVendor;
