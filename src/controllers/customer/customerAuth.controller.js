import Customer from "../../models/customer.model.js"
import OTP from "../../models/otp.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import Joi from "joi";




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


const customerSchema = Joi.object(
    {
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
        name: Joi.string().required(),
        gender: Joi.string().valid("Male", "Female", "Other").required(),
        disabilityStatus: Joi.boolean().required(),
        dob: Joi.date().required(),

    }
)

/**
 * ✅ Customer registration
 */
export const customerRegistrer = asyncHandler(async (req, res) => {
    const { phoneNumber, name, gender, disabilityStatus, dob } = req.body;
    const { error } = customerSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, `Validation Error: ${error.details[0].message}`));
    }

    // Generate tokens
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (existingCustomer) {
        return res.status(400).json(new ApiResponse(400, null, "Customer already registered!"));
    }

    // Create new customer
    const newCustomer = new Customer({
        phoneNumber,
        name,
        gender,
        disabilityStatus,
        dob,
    });

    await newCustomer.save();
    const accessToken = generateAccessToken(newCustomer, "customer");
    const refreshToken = generateRefreshToken(newCustomer, "customer");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                id: newCustomer._id,
                phoneNumber: newCustomer.phoneNumber,
                role: "customer",
                accessToken,
                refreshToken,
            },
            "Customer Registered successfully"
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


    // Hard-coded OTP for demonstration:
    const otp = "123456";

    // Remove any previous OTPs for this phone
    await OTP.deleteMany({ phoneNumber });

    // Create new OTP with a 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({ phoneNumber, otp, expiresAt });
    //    console.log("OTP saved:", otpentry);


    // In a real app, you would integrate with an SMS gateway here:
    // await smsGateway.sendMessage(phoneNumber, Your OTP is ${otp});

    return res.status(200).json({
        success: true,
        message: `OTP generated: ${otp} `,
        // otp // (Optionally return for local dev/testing)
    });
});

const customerLoginSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    otp: Joi.string().required(),
    lattitude: Joi.number().required(),
    longitude: Joi.number().required(),
    deviceToken: Joi.string().required()

})

export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
    const { phoneNumber, otp, latitude, longitude, deviceToken } = req.body;

    // Validate request body
    const { error } = customerLoginSchema.validate(req.body);
    if (error) {
        return res.status(400).json(new ApiResponse(400, null, `Validation Error: ${error.details[0].message}`));
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ phoneNumber });
    if (!otpRecord) {
        return res.status(400).json(new ApiResponse(400, null, "OTP not found for this phone number"));
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
        return res.status(401).json(new ApiResponse(401, null, "Invalid OTP"));
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
        return res.status(401).json(new ApiResponse(401, null, "OTP has expired"));
    }

    // OTP is valid, now check if customer exists
    const existingCustomer = await Customer.findOne({ phoneNumber });

    if (!existingCustomer) {
        return res.status(404).json(new ApiResponse(404, {  userfound: false }, "Customer does not exist!! Please Register"));
    }

    // Generate tokens
    const accessToken = generateAccessToken(existingCustomer, "customer");
    const refreshToken = generateRefreshToken(existingCustomer, "customer");

    // Update deviceToken if provided
    if (deviceToken) {
        existingCustomer.deviceToken = deviceToken;
        await existingCustomer.save();
    }

    // Cleanup used OTP
    await OTP.deleteMany({ phoneNumber });

    // Return successful login response
    return res.status(200).json(new ApiResponse(200, {
        success: true,
        message: "Customer login successful",
        data: {
            user: {
                id: existingCustomer._id,
                phoneNumber: existingCustomer.phoneNumber,
                role: "customer",
                otpVerified:true
            },

            accessToken,
            refreshToken
        }
    }, "Customer Login Successful!!"));
});