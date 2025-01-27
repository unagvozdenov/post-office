export enum ShipmentStatus {
  RECEIVED_ORIGIN = 'Received and processed in the parcel centre of origin',
  RECEIVED_DESTINATION = 'Received and processed in the destination parcel centre',
  DELIVERED = 'Delivered',
}

export enum ShipmentType {
  LETTER = 'Letter',
  PACKAGE = 'Package',
}

export enum WeightCategory {
  LIGHT = 'Less than 1kg',
  MEDIUM = 'Between 1kg and 5kg',
  HEAVY = 'More than 5kg',
}

export interface PostOffice {
  index?: number;
  zipCode: string;
  name: string;
  address: string;
}

export interface Shipment {
  id: string;
  type: ShipmentType;
  status: ShipmentStatus;
  weightCategory: WeightCategory;
  shipmentNumber: string;
  originZipCode: string;
  destinationZipCode: string;
  actualWeight: number;
  createdAt: Date;
  updatedAt: Date;
  index?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  type?: ShipmentType;
  weightCategory?: WeightCategory;
  originZipCode?: string;
  destinationZipCode?: string;
  page?: number;
  limit?: number;
  shipmentNumber?: string;
}
export interface PostOfficeFilters {
  zipCode?: string;
  name?: string;
  page?: number;
  limit?: number;
}
