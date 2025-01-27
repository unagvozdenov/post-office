"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const types_1 = require("../types");
const common_1 = require("../models/common");
const sequelize_1 = require("sequelize");
class ShipmentController {
    constructor() {
        this.getShipmentById = async (req, res) => {
            try {
                const { shipmentNumber } = req.params;
                const shipment = await common_1.Shipment.findByPk(shipmentNumber);
                if (!shipment) {
                    res.status(404).json({ error: "Shipment not found" });
                    return;
                }
                res.status(200).json(shipment);
            }
            catch (error) {
                console.error("Error fetching shipment:", error);
                res.status(500).json({ error: "Failed to fetch shipment" });
            }
        };
    }
    async createShipment(req, res) {
        try {
            const shipmentData = req.body;
            const actualWeight = shipmentData.actualWeight;
            let weightCategory;
            if (actualWeight < 1) {
                weightCategory = types_1.WeightCategory.LIGHT;
            }
            else if (actualWeight >= 1 && actualWeight <= 5) {
                weightCategory = types_1.WeightCategory.MEDIUM;
            }
            else {
                weightCategory = types_1.WeightCategory.HEAVY;
            }
            shipmentData.weightCategory = weightCategory;
            const newShipment = await common_1.Shipment.create(shipmentData);
            res.status(201).json({
                message: "Shipment created successfully",
                shipment: newShipment,
            });
        }
        catch (error) {
            console.error("Error creating shipment:", error);
            res.status(500).json({ error: "Failed to create shipment" });
        }
    }
    async getShipments(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const filters = req.query;
            const whereClause = this.buildWhereClause(filters);
            const { rows: shipments, count: total } = await common_1.Shipment.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [["createdAt", "ASC"]],
            });
            res.status(200).json({
                data: shipments,
                page,
                limit,
                total,
            });
        }
        catch (error) {
            console.error("Error fetching shipments:", error);
            res.status(500).json({ error: "Failed to fetch shipments" });
        }
    }
    async updateShipment(req, res) {
        try {
            const { shipmentNumber } = req.params;
            const shipmentData = req.body;
            const shipment = await common_1.Shipment.findByPk(shipmentNumber);
            if (!shipment) {
                res.status(404).json({ message: "Shipment not found" });
                return;
            }
            await shipment.update(shipmentData);
            res.status(200).json({
                message: "Shipment updated successfully",
                shipment: shipment,
            });
        }
        catch (error) {
            console.error("Error updating shipment:", error);
            res.status(500).json({ error: "Failed to update shipment" });
        }
    }
    async deleteShipment(req, res) {
        try {
            const { shipmentNumber } = req.params;
            await common_1.Shipment.destroy({ where: { shipmentNumber: shipmentNumber } });
            res.status(200).json({ message: "Shipment deleted" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete shipment" });
        }
    }
    async getPackages(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const filters = req.query;
            const whereClause = this.buildWhereClause(filters);
            const { rows: packages, count: total } = await common_1.Shipment.findAndCountAll({
                where: whereClause,
                offset,
                limit,
            });
            res.status(200).json({
                data: packages,
                page,
                limit,
                total,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch shipments" });
        }
    }
    buildWhereClause(filters) {
        const whereClause = {};
        if (filters.type) {
            whereClause.type = filters.type;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        if (filters.weightCategory) {
            whereClause.weightCategory = filters.weightCategory;
        }
        if (filters.originZipCode) {
            whereClause.originZipCode = filters.originZipCode;
        }
        if (filters.shipmentNumber) {
            whereClause.shipmentNumber = {
                [sequelize_1.Op.iLike]: `%${filters.shipmentNumber}%`,
            };
        }
        if (filters.destinationZipCode) {
            whereClause.destinationZipCode = filters.destinationZipCode;
        }
        return whereClause;
    }
}
exports.ShipmentController = ShipmentController;
