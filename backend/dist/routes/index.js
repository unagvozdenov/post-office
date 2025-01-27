"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const shipment_routes_1 = __importDefault(require("./shipment.routes"));
const postOffice_routes_1 = __importDefault(require("./postOffice.routes"));
const router = (0, express_1.Router)();
router.use('/shipments', shipment_routes_1.default);
router.use('/post-offices', postOffice_routes_1.default);
exports.default = router;
