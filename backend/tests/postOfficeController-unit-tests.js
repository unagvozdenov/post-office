"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const chai_1 = require("chai");
describe('PostOfficeController', () => {
    describe('POST /postOffices', () => {
        it('should create a new post office', async () => {
            const postData = { zipCode: '12345', name: 'Test Post Office' };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/postOffices')
                .send(postData);
            (0, chai_1.expect)(response.status).to.equal(201);
            (0, chai_1.expect)(response.body.zipCode).to.equal('12345');
            (0, chai_1.expect)(response.body.name).to.equal('Test Post Office');
        });
        it('should return error if post office with zipCode already exists', async () => {
            const postData = { zipCode: '12345', name: 'Test Post Office' };
            await (0, supertest_1.default)(app_1.default)
                .post('/postOffices')
                .send(postData);
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/postOffices')
                .send(postData);
            (0, chai_1.expect)(response.status).to.equal(400);
            (0, chai_1.expect)(response.body.error).to.equal('Post office with this zip code already exists');
        });
    });
    describe('GET /postOffices', () => {
        it('should return a list of post offices', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/postOffices')
                .query({ page: 1, limit: 10 });
            (0, chai_1.expect)(response.status).to.equal(200);
            (0, chai_1.expect)(response.body.data).to.be.an('array');
            (0, chai_1.expect)(response.body.data.length).to.be.greaterThan(0);
        });
    });
});
