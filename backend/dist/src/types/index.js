"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightCategory = exports.ShipmentType = exports.ShipmentStatus = void 0;
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["RECEIVED_ORIGIN"] = "Received and processed in the parcel centre of origin";
    ShipmentStatus["RECEIVED_DESTINATION"] = "Received and processed in the destination parcel centre";
    ShipmentStatus["DELIVERED"] = "Delivered";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
var ShipmentType;
(function (ShipmentType) {
    ShipmentType["LETTER"] = "Letter";
    ShipmentType["PACKAGE"] = "Package";
})(ShipmentType || (exports.ShipmentType = ShipmentType = {}));
var WeightCategory;
(function (WeightCategory) {
    WeightCategory["LIGHT"] = "Less than 1kg";
    WeightCategory["MEDIUM"] = "Between 1kg and 5kg";
    WeightCategory["HEAVY"] = "More than 5kg";
})(WeightCategory || (exports.WeightCategory = WeightCategory = {}));
