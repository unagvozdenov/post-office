"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "test";
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const db_1 = require("../src/config/db");
const app_1 = __importDefault(require("../src/app"));
describe("PostOfficeController", () => {
    before(async () => {
        await db_1.sequelize.sync({ force: true });
    });
    after(async () => {
        await db_1.sequelize.close();
    });
    describe("POST /post-offices", () => {
        it("should create a new post office", async () => {
            const postData = {
                zipCode: "15000",
                name: "Test Post Office",
                address: "123 Test Street",
            };
            const response = await (0, supertest_1.default)(app_1.default).post("/post-offices").send(postData);
            (0, chai_1.expect)(response.status).to.equal(201);
            (0, chai_1.expect)(response.body.zipCode).to.equal("15000");
            (0, chai_1.expect)(response.body.name).to.equal("Test Post Office");
        });
        it("should return error if post office with zipCode already exists", async () => {
            const postData = { zipCode: "15000", name: "Test Post Office" };
            await (0, supertest_1.default)(app_1.default).post("/post-offices").send(postData);
            const response = await (0, supertest_1.default)(app_1.default).post("/post-offices").send(postData);
            (0, chai_1.expect)(response.status).to.equal(400);
            (0, chai_1.expect)(response.body.error).to.equal("Post office with this zip code already exists");
        });
    });
    describe("GET /post-offices", () => {
        it("should return a list of post offices", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/post-offices")
                .query({ page: 1, limit: 10 });
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body.data).to.be.an("array");
            (0, chai_1.expect)(response.body.data.length).to.be.greaterThan(0);
        });
    });
});
