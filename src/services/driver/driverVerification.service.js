// src/services/driverVerification/driverVerification.service.js
import driverVerificationRepository from "../../repository/Driver/driverVerification.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const createVerificationRecord = async (data) => {
  // Double-check existing phone/email if needed
  const existing = await driverVerificationRepository.findVerificationByPhoneOrEmail(
    data.phoneNumber,
    data.email
  );
  if (existing) {
    throw new ApiError(409, "A verification record with this phone or email already exists");
  }
  return driverVerificationRepository.insertVerificationRecord(data);
};




const getAllVerifications = async (status, page, limit) => {
  return driverVerificationRepository.findAllVerifications(status, page, limit);
};


const getVerificationById = async (id) => {
  const record = await driverVerificationRepository.findVerificationById(id);
  if (!record) {
    throw new ApiError(404, "Verification record not found");
  }
  return record;
};

const updateVerificationStatus = async (verificationId, status,deviceToken,name,content) => {
  const updated = await driverVerificationRepository.updateVerificationStatus(verificationId, status,deviceToken,name,content);
  if (!updated) {
    throw new ApiError(404, "Verification record not found");
  }
  return updated;
};
const updateDriverLocation = async (driverId, latitude, longitude) => {
  const updatedDriver = await driverVerificationRepository.updateDriverLocationById(driverId, latitude, longitude);
  if (!updatedDriver) {
    throw new ApiError(404, "Driver not found for location update");
  }
  return updatedDriver;
};


export default {
  createVerificationRecord,
  getAllVerifications,
  getVerificationById,
  updateVerificationStatus,
  updateDriverLocation
  
};
