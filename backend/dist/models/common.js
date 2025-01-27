"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = exports.PostOffice = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.PostOffice = db_1.sequelize.define('PostOffice', {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
            is: /^[0-9]{5}$/ // Validate ZIP code format
        }
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
});
exports.Shipment = db_1.sequelize.define('Shipment', {
    shipmentNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: () => {
            // Generate a random shipment number
            const prefix = 'SHIP';
            const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            return `${prefix}${random}`;
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: [
            'Received and processed in the parcel centre of origin',
            'Received and processed in the destination parcel centre',
            'Delivered'
        ],
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['Letter', 'Package'],
        allowNull: false
    },
    weightCategory: {
        type: sequelize_1.DataTypes.ENUM,
        values: [
            'Less than 1kg',
            'Between 1kg and 5kg',
            'More than 5kg'
        ],
        allowNull: false
    },
    actualWeight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    originZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: exports.PostOffice,
            key: 'zipCode'
        }
    },
    destinationZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: exports.PostOffice,
            key: 'zipCode'
        }
    }
});
exports.PostOffice.hasMany(exports.Shipment, {
    foreignKey: 'originZipCode',
    sourceKey: 'zipCode',
    as: 'outgoingShipments'
});
exports.PostOffice.hasMany(exports.Shipment, {
    foreignKey: 'destinationZipCode',
    sourceKey: 'zipCode',
    as: 'incomingShipments'
});
exports.Shipment.belongsTo(exports.PostOffice, {
    foreignKey: 'originZipCode',
    targetKey: 'zipCode',
    as: 'originPostOffice'
});
exports.Shipment.belongsTo(exports.PostOffice, {
    foreignKey: 'destinationZipCode',
    targetKey: 'zipCode',
    as: 'destinationPostOffice'
});
exports.PostOffice.sync();
exports.Shipment.sync();
