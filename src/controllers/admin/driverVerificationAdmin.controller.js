// src/controllers/admin/driverVerificationAdmin.controller.js
import driverVerificationService from "../../services/driver/driverVerification.service.js";
import Driver from "../../models/driver.model.js";
import { generateDriverId } from "../../utils/generateDriverId.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import subscriptionService from "../../services/driver/subscription.service.js";

 
const getAllVerifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query; // status is sent as a query parameter
    const records = await driverVerificationService.getAllVerifications(status, page, limit);

    return res.status(200).json(new ApiResponse(200, records.data, "List of verification records", records.meta));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};


const approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.body;
    // 1. Get the verification record
    const verification = await driverVerificationService.getVerificationById(verificationId);
    console.log(verification);
    

    if (verification.verificationStatus !== "pending") {
      throw new ApiError(400, "Verification record is not in pending status");
    }

    // 2. Generate driverId
    const newDriverId = await generateDriverId(verification.city);
    console.log('did',newDriverId);
    

    // 3. Create final driver doc
    const approvedDriver = await Driver.create({
      driverId: newDriverId,
      phoneNumber: verification.phoneNumber,
      email: verification.email,
      name: verification.name,

      city: verification.city,
      gender: verification.gender,
      dob: verification.dob,
      disability: verification.disability,
      deviceToken: verification.deviceToken,
      verified: true,
      vehicleType: verification.vehicleType,

      // Instead of single fields, copy the entire `vehicles` array
      vehicles: verification.vehicles,

      // Document arrays
      docRC: verification.docRC,
      docDL: verification.docDL,
      docAadhar: verification.docAadhar,

      // Copy optional docs as well
      docDisabilityCert: verification.docDisabilityCert,
      docNameProof: verification.docNameProof,

      profileImage: verification.profileImage,
      paymentDue: 0,
    });
     // 4. Call subscriptionService.createBasePlan to assign the Base Plan (15-day)
     const subscription = await subscriptionService.createBasePlan(approvedDriver._id);
     console.log("Base Plan assigned:", subscription);

    // 5. Update verification status
    await driverVerificationService.updateVerificationStatus(verificationId, "verified",approvedDriver.deviceToken,approvedDriver.name);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { driverId: approvedDriver.driverId }, "Driver approved successfully")
      );
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    }
    console.error("approveVerification error:", err);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

 const rejectVerification = async (req, res) => {
  try {
    const { verificationId,message } = req.body;
    const verification = await driverVerificationService.getVerificationById(verificationId);

    if (verification.verificationStatus !== "pending") {
      throw new ApiError(400, "Verification record is not in pending status");
    }

    await driverVerificationService.updateVerificationStatus(verificationId, "rejected",verification.deviceToken,verification.name,message);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Driver verification rejected successfully"));
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message));
    }
    console.error("rejectVerification error:", err);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export  default{
    getAllVerifications,
    approveVerification,
    rejectVerification
}