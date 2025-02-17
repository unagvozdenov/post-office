"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipment_controller_1 = require("../controllers/shipment.controller");
const router = (0, express_1.Router)();
const shipmentController = new shipment_controller_1.ShipmentController();
router.get("/packages", shipmentController.getPackages.bind(shipmentController));
router.post("/", shipmentController.createShipment);
router.get("/", shipmentController.getShipments.bind(shipmentController));
router.get("/:shipmentNumber", shipmentController.getShipmentById);
router.put("/:shipmentNumber", shipmentController.updateShipment);
router.delete("/:shipmentNumber", shipmentController.deleteShipment);
exports.default = router;
