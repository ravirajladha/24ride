// models/city.model.js

import mongoose from "mongoose";

// Optional sub-schema to store bounding box data
const boundingBoxSchema = new mongoose.Schema(
  {
    northeast: {
      lat: { type: Number },
      lng: { type: Number },
    },
    southwest: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

// Sub-schema for fares
const fareSchema = new mongoose.Schema(
  {
    baseFare: { type: Number, default: 0 },
    perKmFare: { type: Number, default: 0 },
    pickupCharge: { type: Number, default: 0 },
    nightSurge: { type: Number, default: 0 },
  },
  { _id: false }
);

const citySchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true },
    cityCode: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    postalCodes: [{ type: String }], // optional array of postal codes
    boundingBox: boundingBoxSchema,  // optional bounding box info

    // City-specific fare details for auto only
    fares: {
      auto: { type: fareSchema, default: {} },
    },
  },
  { timestamps: true } // For createdAt, updatedAt
);

export default mongoose.model("City", citySchema);
