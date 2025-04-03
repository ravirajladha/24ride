// src/controllers/addVehicle/addVehicle.controller.js
import Joi from "joi";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import addVehicleService from "../../services/driver/addVehicle.service.js";

// Validation schema for Add Vehicle
const addVehicleSchema = Joi.object({
  driverId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Validate MongoDB ObjectId format
  vehicleNumber: Joi.string().required(),
  vehicleModel: Joi.string().required(),
  vehicleName: Joi.string().required(),
  seatingCapacity: Joi.number().required(),
  verificationStatus: Joi.string().valid("pending", "verified", "rejected").default("pending"),
});

// Add Vehicle
const addVehicle = asyncHandler(async (req, res) => {
  const { error, value } = addVehicleSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, `Validation Error: ${error.details[0].message}`));
  }

  try {
    const result = await addVehicleService.createAddVehicleRecord(value);
    return res.status(201).json(new ApiResponse(201, result, "Vehicle added successfully"));
  } catch (err) {
    console.error("addVehicle error:", err);
    if (err.statusCode === 404) {
      return res.status(404).json(new ApiResponse(404, null, err.message));
    }
    if (err.statusCode === 409) {
      return res.status(409).json(new ApiResponse(409, null, err.message));
    }
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

// Get All Added Vehicles
const getAllAddedVehicles = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  try {
    const records = await addVehicleService.getAllAddedVehicles(status, page, limit);
    return res.status(200).json(new ApiResponse(200, records.data, "List of added vehicles", records.meta));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

// Get Added Vehicles by DriverId
const getAddedVehiclesByDriverId = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  try {
    const vehicles = await addVehicleService.getAddedVehiclesByDriverId(driverId);
    
    // If vehicles found, send the response with the vehicles
    return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles for the driver", null));
  } catch (err) {
    // If an error occurs, log it and return a 500 response with the error message
    console.log(err);
    
    // If no vehicles are found or any other error, send an appropriate message
    if (err.statusCode === 404) {
      return res.status(404).json(new ApiResponse(404, null, "No vehicles found for the given driver"));
    }
    
    // Generic server error response
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

// Approve Vehicle Verification
const approveVerification = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  try {
    const result = await addVehicleService.approveVerification(vehicleId);
    return res.status(200).json(new ApiResponse(200, result, "Vehicle verification approved"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

// Reject Vehicle Verification
const rejectVerification = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  try {
    const result = await addVehicleService.rejectVerification(vehicleId);
    return res.status(200).json(new ApiResponse(200, result, "Vehicle verification rejected"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export default {
  addVehicle,
  getAllAddedVehicles,
  getAddedVehiclesByDriverId,
  approveVerification,
  rejectVerification,
};
