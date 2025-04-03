// src/repository/driverVerification/driverVerification.repository.js
import DriverVerification from "../../models/driverVerification.model.js";
import Driver from "../../models/driver.model.js";

import { sendPushNotification } from "../../utils/pushNotification.js";
const insertVerificationRecord = async (data) => {
  const newRecord = new DriverVerification(data);
  return await newRecord.save();
};

const findVerificationByPhoneOrEmail = async (phoneNumber, email) => {
  return DriverVerification.findOne({
    $or: [{ phoneNumber }, { email }],
  });
};

const findAllVerifications = async (status, page, limit) => {
  const query = {};
  if (status) {
    query.verificationStatus = status;  // filter by verificationStatus if provided
  }

  const skip = (page - 1) * limit;  // calculate skip value based on current page
  const totalRecords = await DriverVerification.countDocuments(query);  // get total records count
  const records = await DriverVerification.find(query)
   
    .skip(skip)
    .limit(Number(limit));

  const meta = {
    page: Number(page),
    limit: Number(limit),
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
   
  };

  return { data: records, meta };  // return both data and pagination metadata
};


const findVerificationById = async (verificationId) => {
  return DriverVerification.findById(verificationId);
};

const updateVerificationStatus = async (verificationId, status, deviceToken, name, content) => {
  // Construct the notification message based on the status
  let message = "";
  if (status === "verified") {
    message = `Dear ${name}, your documents have been verified by the admin.`;
  } else if (status === "rejected") {
    message = `Dear ${name}, your documents has rejected because ${content}`;
  }

  // Send push notification if deviceToken is present
  if (deviceToken) {
    try {
      await sendPushNotification(deviceToken, message, "driver");
      console.log("Push notification sent successfully");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  } else {
    console.log("No device token available, skipping push notification.");
  }

  // Update the verification status in the database
  return DriverVerification.findByIdAndUpdate(
    verificationId,
    { verificationStatus: status },
    { new: true }
  );
};


const updateDriverLocationById = async (_id, latitude, longitude) => {
  return await Driver.findByIdAndUpdate(
    _id, // Now searching by _id instead of driverId
    {
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // MongoDB stores location as [longitude, latitude]
      },
    },
    { new: true } // Returns updated document
  );
};


export default {
  insertVerificationRecord,
  findVerificationByPhoneOrEmail,
  findAllVerifications,
  findVerificationById,
  updateVerificationStatus,
  updateDriverLocationById
};
