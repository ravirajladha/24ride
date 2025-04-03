// src/repository/Driver/addVehicle.repository.js
import AddVehicle from "../../models/AddVehicle.js";

// Insert a new vehicle record into the database (No changes here)
const insertAddVehicleRecord = async (data) => {
  const newVehicle = new AddVehicle(data);
  return await newVehicle.save();
};

// Find a vehicle by driver ID and vehicle number (No changes here)
const findVehicleByDriverIdAndNumber = async (vehicleNumber) => {
  return AddVehicle.findOne({ vehicleNumber });
};

// Find all vehicles with pagination and status filter
const findAllAddedVehicles = async (status, page, limit) => {
  const query = {};
  if (status) {
    query.verificationStatus = status;
  }

  const skip = (page - 1) * limit;
  const totalRecords = await AddVehicle.countDocuments(query);
  const records = await AddVehicle.find(query)
    .skip(skip)
    .limit(Number(limit));

  const meta = {
    page: Number(page),
    limit: Number(limit),
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };

  return { data: records, meta };
};

// Find vehicles by driverId
const findVehiclesByDriverId = async (driverId) => {
  return AddVehicle.find({ driverId });
};

// Find a vehicle by its ID
const findVehicleById = async (vehicleId) => {
  return AddVehicle.findById(vehicleId);
};

export default {
  insertAddVehicleRecord,
  findVehicleByDriverIdAndNumber,
  findAllAddedVehicles,
  findVehiclesByDriverId,
  findVehicleById,
};
