import express from "express";
import { insertVendors , fetchVendorsData , getNearbyVendors} from '../controllers/vendorController.js'

const router = express.Router();

router.post("/vendors", insertVendors);
router.get("/fetchvendors", fetchVendorsData);
router.get('/nearby', getNearbyVendors);

export default router;
