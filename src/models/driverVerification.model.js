// src/models/driverVerification.model.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String, default: "" },
  vehicleName: { type: String, default: "" },

  vehicleYear: { type: String, default: "" },
  seatingCapacity: { type: Number, default: 0 },

  // Put docRC here for each vehicle
  docRC: [{ type: String }], 
});

const driverVerificationSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, required: false,default: "" },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    city: { type: String, required: true },
    dob: { type: Date, default: null },
    disability: { type: Boolean, default: false },
    deviceToken: { type: String, default: "" },

    vehicleType: {
      type: String,
      enum: ["Auto", "OutstationCab"],
      required: true,
    },

    // For "Auto" => exactly one vehicle
    // For "OutstationCab" => can store multiple vehicles
    vehicles: [vehicleSchema],

    // Other docs remain top-level if you want them shared (not per vehicle):
    docDL: [{ type: String }],
    docAadhar: [{ type: String }],
    docDisabilityCert: [{ type: String }],
    docNameProof: [{ type: String }],
    profileImage: [{ type: String }],

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DriverVerification", driverVerificationSchema);
