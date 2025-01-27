import { Router } from "express";
import shipmentRoutes from "./shipment.routes";
import postOfficeRoutes from "./postOffice.routes";

const router = Router();

router.use("/shipments", shipmentRoutes);
router.use("/post-offices", postOfficeRoutes);

export default router;
