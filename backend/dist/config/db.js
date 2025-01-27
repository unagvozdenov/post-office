"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('post_office_db', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});
exports.sequelize = sequelize;
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Postgres connected');
    }
    catch (error) {
        console.error('Failed to connect to Postgres', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
