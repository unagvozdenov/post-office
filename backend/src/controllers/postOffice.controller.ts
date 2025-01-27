import { Request, Response } from "express";
import { PostOffice } from "../models/commonModels";
import { IPaginationQuery, PostOfficeFilters } from "../types/commonTypes";
import { Op } from "sequelize";

export class PostOfficeController {
  public async createPostOffice(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode } = req.body;

      const existingPostOffice = await PostOffice.findOne({
        where: { zipCode },
      });
      if (existingPostOffice) {
        res
          .status(400)
          .json({ error: "Post office with this zip code already exists" });
      } else {
        const postOffice = await PostOffice.create(req.body);
        res.status(201).json(postOffice);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to create post office" });
    }
  }

  public async getPostOffices(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query as unknown as IPaginationQuery;
      const offset = (page - 1) * limit;

      const filters = req.query as PostOfficeFilters;
      const whereClause = this.buildWhereClause(filters);
      const { rows: postOffices, count: total } =
        await PostOffice.findAndCountAll({
          where: whereClause,
          offset,
          limit,
          order: [["createdAt", "ASC"]],
        });

      res.status(200).json({
        data: postOffices,
        page,
        limit,
        total,
      });
    } catch (error) {
      console.error("Error fetching post offices:", error);
      res.status(500).json({ error: "Failed to fetch post offices" });
    }
  }

  public async getPostOfficeByZipCode(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { zipCode } = req.params;
      const postOffice = await PostOffice.findOne({ where: { zipCode } });

      if (!postOffice) {
        res.status(404).json({ error: "Post office not found" });
      } else {
        res.status(200).json(postOffice);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post office" });
    }
  }

  public async updatePostOffice(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode } = req.params;
      const postOfficeData = req.body;

      const postOffice = await PostOffice.findByPk(zipCode);
      if (!postOffice) {
        res.status(404).json({ message: "Post office not found" });
        return;
      }

      await postOffice.update(postOfficeData);

      res.status(200).json({
        message: "Post office updated successfully",
        shipment: postOffice,
      });
    } catch (error) {
      console.error("Error updating post office:", error);
      res.status(500).json({ error: "Failed to update post office" });
    }
  }

  public async deletePostOffice(req: Request, res: Response): Promise<void> {
    try {
      const { zipCode } = req.params;
      await PostOffice.destroy({ where: { zipCode: zipCode } });
      res.status(200).json({ message: "Post office deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post office" });
    }
  }

  private buildWhereClause(filters: PostOfficeFilters): any {
    const whereClause: any = {};

    if (filters.name) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.zipCode) {
      whereClause.zipCode = { [Op.iLike]: `%${filters.zipCode}%` };
    }

    return whereClause;
  }
}
