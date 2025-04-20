import express from "express";
import { insertVendors , fetchVendorsData , getNearbyVendors , getVendorById ,getFilteredVendors} from '../controllers/vendorController.js'

const router = express.Router();

router.post("/vendors", insertVendors);
router.get("/fetchvendors", fetchVendorsData);
router.get('/nearby', getNearbyVendors);
router.get('/vendors/:vendorId', getVendorById);
router.post("/vendors/filter", getFilteredVendors);
export default router;
