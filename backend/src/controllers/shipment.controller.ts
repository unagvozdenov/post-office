import { Request, RequestHandler, Response } from "express";
import {
  IPaginationQuery,
  IShipmentFilters,
  WeightCategory,
} from "../types/commonTypes";
import { Shipment } from "../models/commonModels";
import { Op } from "sequelize";

export class ShipmentController {
  public async createShipment(req: Request, res: Response): Promise<void> {
    try {
      const shipmentData = req.body;
      const actualWeight = shipmentData.actualWeight;
      shipmentData.weightCategory = this.assignWeightCategory(actualWeight);

      const newShipment = await Shipment.create(shipmentData);

      res.status(201).json({
        message: "Shipment created successfully",
        shipment: newShipment,
      });
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  public async getShipments(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query as unknown as IPaginationQuery;
      const offset = (page - 1) * limit;

      const filters = req.query as IShipmentFilters;
      const whereClause = this.buildWhereClause(filters);
      const { rows: shipments, count: total } = await Shipment.findAndCountAll({
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
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  }

  public async getShipmentById(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;

      const shipment = await Shipment.findByPk(shipmentNumber);

      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      res.status(200).json(shipment);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ error: "Failed to fetch shipment" });
    }
  }

  public async updateShipment(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;
      const shipmentData = req.body;

      const shipment = await Shipment.findByPk(shipmentNumber);
      if (!shipment) {
        res.status(404).json({ message: "Shipment not found" });
        return;
      }

      await shipment.update(shipmentData);

      res.status(200).json({
        message: "Shipment updated successfully",
        shipment: shipment,
      });
    } catch (error) {
      console.error("Error updating shipment:", error);
      res.status(500).json({ error: "Failed to update shipment" });
    }
  }

  public async deleteShipment(req: Request, res: Response): Promise<void> {
    try {
      const { shipmentNumber } = req.params;
      await Shipment.destroy({ where: { shipmentNumber: shipmentNumber } });
      res.status(200).json({ message: "Shipment deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shipment" });
    }
  }

  private buildWhereClause(filters: IShipmentFilters): any {
    const whereClause: any = {};

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
        [Op.iLike]: `%${filters.shipmentNumber}%`,
      };
    }
    if (filters.destinationZipCode) {
      whereClause.destinationZipCode = filters.destinationZipCode;
    }

    return whereClause;
  }

  private assignWeightCategory(actualWeight: number): string {
    if (actualWeight < 1) {
      return WeightCategory.LIGHT;
    } else if (actualWeight >= 1 && actualWeight <= 5) {
      return WeightCategory.MEDIUM;
    } else {
      return WeightCategory.HEAVY;
    }
  }
}
