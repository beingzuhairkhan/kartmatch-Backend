import mongoose from 'mongoose';

const bengalVendorSchema = new mongoose.Schema({
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
  foodItems: [String],
  hygieneRating: String,
  tasteRating: String,
  hospitalityRating: String,
  photoUrl: String,
});

bengalVendorSchema.index({ location: '2dsphere' });

const BengalVendor = mongoose.model('BengalVendor', bengalVendorSchema);
export default BengalVendor;
