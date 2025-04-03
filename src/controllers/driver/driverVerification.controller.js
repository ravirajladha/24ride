// src/controllers/driverVerification/driverVerification.controller.js
import Joi from "joi";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import driverVerificationService from "../../services/driver/driverVerification.service.js";
import driverVerificationRepository from "../../repository/Driver/driverVerification.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const vehicleSchema = Joi.object({
  vehicleNumber: Joi.string().allow(""),
  vehicleModel: Joi.string().allow(""),
  vehicleName: Joi.string().allow(""),
  seatingCapacity: Joi.number().default(0),
  // docRC is handled via file uploads, not JSON in the request body
});

const createDriverVerification = asyncHandler(async (req, res) => {
console.log("Received Body:", req.body);
console.log("Received Files:", req.files);

  // 1. Parse JSON "vehicles" if it's a string
  if (req.body.vehicles && typeof req.body.vehicles === "string") {
    try {
      req.body.vehicles = JSON.parse(req.body.vehicles);
    } catch (e) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid JSON format for 'vehicles'"));
    }
  }

  // 2. Validate basic driver info
  const baseSchema = Joi.object({
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().optional(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    dob: Joi.date().optional(),
    disability: Joi.boolean().default(false),
    vehicleType: Joi.string().valid("Auto", "OutstationCab").required(),
    vehicles: Joi.array().items(vehicleSchema).required(),
    deviceToken: Joi.string().required(),
  });

  const { error, value } = baseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          `Validation Error: ${error.details[0].message}`
        )
      );
  }

  // 3. Additional checks for Auto vs. OutstationCab
  if (value.vehicleType === "Auto") {
    if (value.vehicles.length !== 1) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "For 'Auto', you must provide exactly 1 vehicle"
          )
        );
    }
    // Must have vehicleNumber
    if (!value.vehicles[0].vehicleNumber) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "For 'Auto', 'vehicleNumber' is required"
          )
        );
    }
  } else if (value.vehicleType === "OutstationCab") {
    if (value.vehicles.length < 1) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "For 'OutstationCab', provide at least 1 vehicle"
          )
        );
    }
    // For each vehicle, must have vehicleNumber, model, year, seat capacity
    value.vehicles.forEach((v, i) => {
      if (!v.vehicleNumber || !v.vehicleModel || !v.vehicleName || !v.seatingCapacity) {
        throw new ApiResponse(
          400,
          null,
          `For 'OutstationCab', all vehicle fields are required for index ${i}`
        );
      }
    });
  }

  // 4. Check if phone/email exist
  const existing = await driverVerificationRepository.findVerificationByPhoneOrEmail(
    value.phoneNumber,
    value.email
  );
  if (existing) {
    return res
      .status(409)
      .json(
        new ApiResponse(409, null, "Verification record with this phone or email already exists")
      );
  }

  // 5. We'll collect top-level docs in a simpler way:
  //    docDL, docAadhar, docNameProof, docDisabilityCert, profileImage
  //    can remain optional or required based on your logic.
  
  // Helper function to upload multiple files to Cloudinary
  const uploadFiles = async (fileArray, folderName) => {
    const urls = [];
    for (let file of fileArray) {
      const uploaded = await uploadOnCloudinary(file.path, folderName);
      if (uploaded?.secure_url) urls.push(uploaded.secure_url);
    }
    return urls;
  };

  // Because we used `upload.any()`, req.files is an *array* of files
  // We can group them by their fieldname:
  const filesByField = req.files.reduce((acc, file) => {
    if (!acc[file.fieldname]) acc[file.fieldname] = [];
    acc[file.fieldname].push(file);
    return acc;
  }, {});

  // Now, parse the top-level docs if they exist
  const docDL = filesByField.docDL
    ? await uploadFiles(filesByField.docDL, "24Rides/DriverVerification")
    : [];
  const docAadhar = filesByField.docAadhar
    ? await uploadFiles(filesByField.docAadhar, "24Rides/DriverVerification")
    : [];
  const docDisabilityCert = filesByField.docDisabilityCert
    ? await uploadFiles(filesByField.docDisabilityCert, "24Rides/DriverVerification")
    : [];
  const docNameProof = filesByField.docNameProof
    ? await uploadFiles(filesByField.docNameProof, "24Rides/DriverVerification")
    : [];
  const profileImage = filesByField.profileImage
    ? await uploadFiles(filesByField.profileImage, "24Rides/DriverVerification")
    : [];

  // 6. Dynamically parse docRC_{index} fields
  // We'll group them by vehicle index
  // e.g., docRC_0 => for vehicle[0], docRC_1 => for vehicle[1], etc.
  const docRCByIndex = {};

  for (const fieldName of Object.keys(filesByField)) {
    if (fieldName.startsWith("docRC_")) {
      // fieldName is something like "docRC_0" or "docRC_2"
      const indexStr = fieldName.replace("docRC_", ""); // e.g. "0"
      const index = parseInt(indexStr, 10);

      // If it's a valid integer
      if (!isNaN(index)) {
        // Upload these files
        const rcFiles = filesByField[fieldName];
        const uploadedUrls = await uploadFiles(rcFiles, "24Rides/DriverVerification");

        // Store them in docRCByIndex
        docRCByIndex[index] = (docRCByIndex[index] || []).concat(uploadedUrls);
      }
    }
  }

  // 7. Attach uploaded docRCs to each vehicle
  const finalVehicles = value.vehicles.map((vehicle, i) => {
    // If docRC is required, ensure we have some images for this index
    if (!docRCByIndex[i] || docRCByIndex[i].length === 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `docRC files are required for vehicle index ${i}`
          )
        );
    }

    // Attach them
    return {
      ...vehicle,
      docRC: docRCByIndex[i],
    };
  });

  // 8. Construct final verification data
  const verificationData = {
    phoneNumber: value.phoneNumber,
    email: value.email,
    name: value.name,
    city: value.city,
    gender: value.gender,
    dob: value.dob,
    disability: value.disability,
    deviceToken: value.deviceToken,
    vehicleType: value.vehicleType,
    vehicles: finalVehicles,

    docDL,
    docAadhar,
    docNameProof,
    docDisabilityCert,
    profileImage,

    verificationStatus: "pending",
  };

  // 9. Create the verification record
  try {
    const result = await driverVerificationService.createVerificationRecord(verificationData);
    return res
      .status(201)
      .json(new ApiResponse(201, result, "Driver verification record created"));
  } catch (err) {
    console.error("createDriverVerification error:", err);
    if (err.statusCode === 409) {
      return res.status(409).json(new ApiResponse(409, null, err.message));
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
});
const updateDriverLocation = async (req, res) => {
  try {
 
    const { latitude, longitude,driverId } = req.body;

    if (!latitude || !longitude) {
      throw new ApiError(400, "Latitude and Longitude are required");
    }

    const updatedDriver = await driverVerificationService.updateDriverLocation(driverId, latitude, longitude);

    return res.status(200).json(new ApiResponse(200, updatedDriver, "Driver location updated successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("updateDriverLocation error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};


export default{
  createDriverVerification,
  updateDriverLocation
}