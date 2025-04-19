import mongoose from 'mongoose';

const rajasthanVendorSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
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
  foodItems: [String],
  hygieneRating: String,
  tasteRating: String,
  hospitalityRating: String,
  photoUrl: String,
});

rajasthanVendorSchema.index({ location: '2dsphere' });

const RajasthanVendor = mongoose.model('RajasthanVendor', rajasthanVendorSchema);
export default RajasthanVendor;
