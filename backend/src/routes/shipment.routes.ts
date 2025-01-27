import { Router } from "express";
import { ShipmentController } from "../controllers/shipment.controller";

const router = Router();
const shipmentController = new ShipmentController();

router.post("/", shipmentController.createShipment.bind(shipmentController));
router.get("/", shipmentController.getShipments.bind(shipmentController));
router.get("/:shipmentNumber", shipmentController.getShipmentById);
router.put("/:shipmentNumber", shipmentController.updateShipment);
router.delete("/:shipmentNumber", shipmentController.deleteShipment);

export default router;
