import express from "express";
import { insertVendors , fetchVendorsData , getNearbyVendors , getVendorById} from '../controllers/vendorController.js'

const router = express.Router();

router.post("/vendors", insertVendors);
router.get("/fetchvendors", fetchVendorsData);
router.get('/nearby', getNearbyVendors);
router.get('/vendors/:vendorId', getVendorById);
export default router;
