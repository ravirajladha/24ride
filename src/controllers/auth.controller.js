import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import Admin from "../models/admin.model.js";
import Driver from "../models/driver.model.js";
import OTP from "../models/otp.model.js";
import driverVerificationService from "../services/driver/driverVerification.service.js";
import Subscription from "../models/subscription.model.js";
import subscriptionModel from "../models/subscription.model.js";
import Feedback from "../models/feedback.model.js";
import { sendOtpPhone } from "../utils/sendotp.js";
import otpGenerator from "otp-generator";


dotenv.config();      

/**
 * Generate Access Token
 * @param {Object} user - User object (Admin, Driver, etc.)
 * @param {String} role - User role (e.g. "admin", "driver")
 * @returns {string} JWT Token
 */
const generateAccessToken = (user, role) => {
  return jwt.sign(
    {
      userId: user._id, // you only store what you need in the token
      role: role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};

/**
 * Generate Refresh Token
 * @param {Object} user - User object (Admin, Driver, etc.)
 * @param {String} role - User role
 * @returns {string} JWT Refresh Token
 */
const generateRefreshToken = (user, role) => {
  return jwt.sign(
    {
      userId: user._id,
      role: role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

/**
 * ✅ Admin Login (Email + Password)
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email and password are required"));
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Admin user not found"));
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials"));
  }

  // Generate tokens
  const accessToken = generateAccessToken(admin, "admin");
  const refreshToken = generateRefreshToken(admin, "admin");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { id: admin._id, email: admin.email, role: "admin" },
        accessToken,
        refreshToken,
      },
      "Admin login successful"
    )
  );
});

/**
 * 1) Send OTP (Driver only)
 */
export const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  // Check if driver exists
  const driverExists = await Driver.findOne({ phoneNumber });
  if (!driverExists) {
    return res
      .status(404)
      .json({ success: false, message: "Driver not exists" });
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Remove any existing OTP for this phone
  await OTP.deleteMany({ phoneNumber });

  // Create new OTP with a 10-minute expiry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.create({ phoneNumber, otp, expiresAt });

  // Send the OTP via your BulkSMS/HTTP function
  await sendOtpPhone(phoneNumber, otp);

  return res.status(200).json({
    success: true,
    message: "OTP generated and sent successfully",
    city: driverExists.city,
  });
});
/**
 * 2) Verify OTP & Login (Driver only)
 */
/**
 * 2) Verify OTP & Login (Driver only)
 */
export const verifyOtpAndLogin = asyncHandler(async (req, res) => { 
  const { phoneNumber, otp, longitude, latitude, deviceToken } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  if (!longitude || !latitude) {
    return res.status(400).json({ success: false, message: "Longitude and latitude are required" });
  }

  // Find the OTP record
  const otpRecord = await OTP.findOne({ phoneNumber, otp });
  if (!otpRecord) {
    return res.status(401).json({ success: false, message: "Invalid OTP or OTP Expired" });
  }

  // Check if expired
  if (otpRecord.expiresAt < new Date()) {
    return res.status(401).json({ success: false, message: "OTP has expired" });
  }

  // Find the corresponding Driver
  const driver = await Driver.findOne({ phoneNumber });
  if (!driver) {
    return res.status(404).json({ success: false, message: "Driver not found or not registered" });
  }

  


  // Update deviceToken if provided
  if (deviceToken) {
    driver.deviceToken = deviceToken;
    await driver.save(); // Save the updated driver document
  }

  // ✅ Update Driver Location & Wait for Updated Data
  const updatedDriver = await driverVerificationService.updateDriverLocation(driver._id, latitude, longitude);

  // Generate tokens
  const accessToken = generateAccessToken(driver, "driver");
  const refreshToken = generateRefreshToken(driver, "driver");

  // Cleanup: Remove used OTP to prevent reuse
  await OTP.deleteMany({ phoneNumber });

  // ✅ Return the updated location in the response
  return res.status(200).json({
    success: true,
    message: "Driver login successful",
    data: {
      user: {
        id: updatedDriver._id,
        vehicleType:updatedDriver.vehicleType,
        driverId: updatedDriver.driverId,
        phoneNumber: updatedDriver.phoneNumber,
        name: updatedDriver.name,
        city: updatedDriver.city,
       
        location: updatedDriver.location, // ✅ Updated location returned
        role: "driver",
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * ✅ Logout (Client Side Should Discard Tokens)
 */
export const logout = asyncHandler(async (req, res) => {
  // Typically just tell the client to remove/ignore the token; 
  // if using a token blacklist, handle it here.
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});


//driver delete account
// Driver account deletion
export const deleteDriverAccount = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  // Log the user data for debugging
  console.log('User data:', req.user);
  console.log('Driver ID:', driverId);

  // Find the driver to delete
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ success: false, message: "Driver not found" });
  }

  // Delete the driver's related data (e.g., OTP records, subscriptions)
  await OTP.deleteMany({ phoneNumber: driver.phoneNumber });  // Remove OTP records
  await subscriptionModel.deleteMany({ driverId: driver._id });  // Remove active subscriptions
  await Feedback.deleteMany({ driverId: driverId });  // Example: Delete feedback if applicable

  // Delete the driver record
  const deletedDriver = await Driver.findByIdAndDelete(driverId);
  if (!deletedDriver) {
    return res.status(404).json({ success: false, message: "Driver not found for deletion" });
  }

  return res.status(200).json({
    success: true,
    message: "Driver account deleted successfully",
  });
});

//profile
export const getDriverProfile = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  // Log the user data for debugging
  console.log('User data:', req.user);
  console.log('Driver ID:', driverId);

  // Find the driver to get profile data
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ success: false, message: "Driver not found" });
  }

  // Create the response object for driver profile
  const driverProfile = {
    user: {
      id: driver._id,
      vehicleType: driver.vehicleType,
      driverId: driver.driverId,
      phoneNumber: driver.phoneNumber,
      name: driver.name,
      vheicles:driver.vehicles,
      city: driver.city,
      
      location: driver.location, // The updated location
      role: "driver",
    }
  };

  return res.status(200).json({
    success: true,
    data: driverProfile,
  });
});


