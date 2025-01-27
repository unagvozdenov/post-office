"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostOfficeController = void 0;
const common_1 = require("../models/common");
const sequelize_1 = require("sequelize");
class PostOfficeController {
    async createPostOffice(req, res) {
        try {
            const { zipCode } = req.body;
            const existingPostOffice = await common_1.PostOffice.findOne({
                where: { zipCode },
            });
            if (existingPostOffice) {
                res
                    .status(400)
                    .json({ error: "Post office with this zip code already exists" });
            }
            else {
                const postOffice = await common_1.PostOffice.create(req.body);
                res.status(201).json(postOffice);
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create post office" });
        }
    }
    async getPostOffices(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const filters = req.query;
            const whereClause = this.buildWhereClause(filters);
            const { rows: postOffices, count: total } = await common_1.PostOffice.findAndCountAll({
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
        }
        catch (error) {
            console.error("Error fetching post offices:", error);
            res.status(500).json({ error: "Failed to fetch post offices" });
        }
    }
    async getPostOfficeByZipCode(req, res) {
        try {
            const { zipCode } = req.params;
            const postOffice = await common_1.PostOffice.findOne({ where: { zipCode } });
            if (!postOffice) {
                res.status(404).json({ error: "Post office not found" });
            }
            else {
                res.status(200).json(postOffice);
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch post office" });
        }
    }
    async updatePostOffice(req, res) {
        try {
            const { zipCode } = req.params;
            const postOfficeData = req.body;
            const postOffice = await common_1.PostOffice.findByPk(zipCode);
            if (!postOffice) {
                res.status(404).json({ message: "Post office not found" });
                return;
            }
            await postOffice.update(postOfficeData);
            res.status(200).json({
                message: "Post office updated successfully",
                shipment: postOffice,
            });
        }
        catch (error) {
            console.error("Error updating post office:", error);
            res.status(500).json({ error: "Failed to update post office" });
        }
    }
    async deletePostOffice(req, res) {
        try {
            const { zipCode } = req.params;
            await common_1.PostOffice.destroy({ where: { zipCode: zipCode } });
            res.status(200).json({ message: "Post office deleted" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete post office" });
        }
    }
    buildWhereClause(filters) {
        const whereClause = {};
        if (filters.name) {
            whereClause.name = { [sequelize_1.Op.iLike]: `%${filters.name}%` };
        }
        if (filters.zipCode) {
            whereClause.zipCode = { [sequelize_1.Op.iLike]: `%${filters.zipCode}%` };
        }
        return whereClause;
    }
}
exports.PostOfficeController = PostOfficeController;
