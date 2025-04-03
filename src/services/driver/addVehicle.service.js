// src/services/driver/addVehicle.service.js
import addVehicleRepository from "../../repository/Driver/addVehicle.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import Driver from "../../models/driver.model.js";

// Create Add Vehicle Record (No changes here)
const createAddVehicleRecord = async (data) => {
  const driverExists = await Driver.findById(data.driverId);
  if (!driverExists) {
    throw new ApiError(404, "Driver does not exist. Cannot add vehicle.");
  }

  const existingVehicle = await addVehicleRepository.findVehicleByDriverIdAndNumber(data.vehicleNumber);
  if (existingVehicle) {
    throw new ApiError(409, "A vehicle with this number already exists for this driver");
  }

  return addVehicleRepository.insertAddVehicleRecord(data);
};

// Get All Added Vehicles (With Pagination & Status Filter)
const getAllAddedVehicles = async (status, page, limit) => {
  return addVehicleRepository.findAllAddedVehicles(status, page, limit);
};

// Get Added Vehicles by DriverId
const getAddedVehiclesByDriverId = async (driverId) => {
  const vehicles = await addVehicleRepository.findVehiclesByDriverId(driverId);
  
  // Check if no vehicles found
  if (!vehicles || vehicles.length === 0) {
    throw new ApiError(404, "No vehicles found for the given driver.");
  }
  
  return vehicles;
};
// Approve Vehicle Verification (Change Status to 'Verified')
const approveVerification = async (vehicleId) => {
  const vehicle = await addVehicleRepository.findVehicleById(vehicleId);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  vehicle.verificationStatus = "verified";
  await vehicle.save();
  return vehicle;
};

// Reject Vehicle Verification (Change Status to 'Rejected')
const rejectVerification = async (vehicleId) => {
  const vehicle = await addVehicleRepository.findVehicleById(vehicleId);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  vehicle.verificationStatus = "rejected";
  await vehicle.save();
  return vehicle;
};

export default {
  createAddVehicleRecord,
  getAllAddedVehicles,
  getAddedVehiclesByDriverId,
  approveVerification,
  rejectVerification,
};
