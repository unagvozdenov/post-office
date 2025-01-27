import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const PostOffice = sequelize.define("PostOffice", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      is: /^[0-9]{5}$/,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Shipment = sequelize.define("Shipment", {
  shipmentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: () => {
      const prefix = "SHIP";
      const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      return `${prefix}${random}`;
    },
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      "Received and processed in the parcel centre of origin",
      "Received and processed in the destination parcel centre",
      "Delivered",
    ],
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["Letter", "Package"],
    allowNull: false,
  },
  weightCategory: {
    type: DataTypes.ENUM,
    values: ["Less than 1kg", "Between 1kg and 5kg", "More than 5kg"],
    allowNull: false,
  },
  actualWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  originZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: PostOffice,
      key: "zipCode",
    },
  },
  destinationZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: PostOffice,
      key: "zipCode",
    },
  },
});

PostOffice.hasMany(Shipment, {
  foreignKey: "originZipCode",
  sourceKey: "zipCode",
  as: "outgoingShipments",
  onDelete: "CASCADE",
});

PostOffice.hasMany(Shipment, {
  foreignKey: "destinationZipCode",
  sourceKey: "zipCode",
  as: "incomingShipments",
  onDelete: "CASCADE",
});

Shipment.belongsTo(PostOffice, {
  foreignKey: "originZipCode",
  targetKey: "zipCode",
  as: "originPostOffice",
  onDelete: "CASCADE",
});

Shipment.belongsTo(PostOffice, {
  foreignKey: "destinationZipCode",
  targetKey: "zipCode",
  as: "destinationPostOffice",
  onDelete: "CASCADE",
});

PostOffice.sync();
Shipment.sync();
