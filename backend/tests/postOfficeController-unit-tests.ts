process.env.NODE_ENV = "test";
import request from "supertest";
import { expect } from "chai";
import { sequelize } from "../src/config/db";
import app from "../src/app";

describe("PostOfficeController", () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  after(async () => {
    await sequelize.close();
  });

  describe("POST /post-offices", () => {
    it("should create a new post office", async () => {
      const postData = {
        zipCode: "15000",
        name: "Test Post Office",
        address: "123 Test Street",
      };

      const response = await request(app).post("/post-offices").send(postData);

      expect(response.status).to.equal(201);
      expect(response.body.zipCode).to.equal("15000");
      expect(response.body.name).to.equal("Test Post Office");
    });

    it("should return error if post office with zipCode already exists", async () => {
      const postData = { zipCode: "15000", name: "Test Post Office" };

      await request(app).post("/post-offices").send(postData);

      const response = await request(app).post("/post-offices").send(postData);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(
        "Post office with this zip code already exists",
      );
    });
  });

  describe("GET /post-offices", () => {
    it("should return a list of post offices", async () => {
      const response = await request(app)
        .get("/post-offices")
        .query({ page: 1, limit: 10 });

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.greaterThan(0);
    });
  });
});
