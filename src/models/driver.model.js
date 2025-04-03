// File: driver.model.js

import mongoose from 'mongoose';
import cron from 'node-cron';
import AutoSubscription from './autoSubscription.model.js';
import CabSubscription from './CabSubscription.model.js';

const { Schema } = mongoose;

// ==========================
// 1. Subscription Sub-Schema
// ==========================
const subscriptionSchema = new Schema({
  planId: { type: Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiry: { type: Date, required: true },
});

// ==========================
// 2. Vehicle Sub-Schema
// ==========================
const vehicleSchema = new Schema({
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String, default: "" },
  vehicleName: { type: String, default: "" },
  seatingCapacity: { type: Number, default: 0 },
  subscription: { type: subscriptionSchema, required: false }, // can be assigned later
});

// ==========================
// 3. Assign Subscription Logic
// ==========================
// Instead of reading vehicle.vehicleType (which doesn't exist now),
// we pass the driver's type into the function.
const assignSubscriptionToVehicle = async (vehicle, driverType) => {
  try {
    // Example: Hard-coded 15 days, or use plan.duration
    

    if (driverType === 'Auto') {
      // e.g., "Basic Plan" for autos
      const plan = await AutoSubscription.findOne({ planName: 'Basic Plan', isActive: true });
      if (plan) {
        // If you want to respect the plan's duration:
        // const planExpiry = new Date();
        // planExpiry.setDate(planExpiry.getDate() + plan.duration);
        const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

        vehicle.subscription = {
          planId: plan._id,
          price: plan.price,
          isActive: true,
          expiry: expiryDate, // or planExpiry
        };
      }
    } else if (driverType === 'OutstationCab') {
      // Derive capacity bracket
      let seatingCategory;
      if (vehicle.seatingCapacity <= 5) {
        seatingCategory = '0-5 Seater';
      } else if (vehicle.seatingCapacity <= 10) {
        seatingCategory = '6-10 Seater';
      } else if (vehicle.seatingCapacity <= 17) {
        seatingCategory = '11-17 Seater';
      } else {
        seatingCategory = 'More than 18 Seater';
      }

      const plan = await CabSubscription.findOne({ seatingCapacity: seatingCategory, isActive: true });
      if (plan) {
        vehicle.subscription = {
          planId: plan._id,
          price: plan.monthlySubscriptionPrice,
          isActive: false, // for example, if you want them to pay first
          expiry: new Date(), // or set a future date
        };
      }
    }
  } catch (error) {
    console.error("Error assigning subscription:", error);
  }
};

// ==========================
// 4. Driver Schema
// ==========================
const driverSchema = new Schema(
  {
    driverId: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, default: "" },
    name: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], },
    dob: { type: Date, default: null },
    disability: { type: Boolean, default: false },
    deviceToken: { type: String, default: "" },
    verified: { type: Boolean, default: true },

    // Single vehicleType for the entire driver
    vehicleType: { type: String, enum: ["Auto", "OutstationCab"], required: true },

    vehicles: [vehicleSchema],

    // Documents
    docRC: [{ type: String }],
    docDL: [{ type: String }],
    docAadhar: [{ type: String }],
    docDisabilityCert: [{ type: String }],  
    docNameProof: [{ type: String }],
    profileImage: [{ type: String }],

    paymentDue: { type: Number, default: 0.0 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
  },
  { timestamps: true }
);

// ==========================
// 5. Hooks for Assigning Subs
// ==========================

// Pre-save: assign a subscription for each vehicle
driverSchema.pre("save", async function (next) {
  for (const vehicle of this.vehicles) {
    // Only if no subscription yet (or remove the if-check if you want to overwrite)
    if (!vehicle.subscription) {
      await assignSubscriptionToVehicle(vehicle, this.vehicleType);
    }
  }
  next();
});

// Post-update: if you do findOneAndUpdate and add new vehicles, re-assign
driverSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    for (const vehicle of doc.vehicles) {
      if (!vehicle.subscription) {
        await assignSubscriptionToVehicle(vehicle, doc.vehicleType);
      }
    }
    await doc.save();
  }
});

// ==========================
// 6. Daily Cron Expiry Check
// ==========================
const checkSubscriptionExpiry = async () => {
  try {
    const drivers = await Driver.find();
    for (const driver of drivers) {
      let updated = false;
      for (const vehicle of driver.vehicles) {
        if (vehicle.subscription?.isActive && new Date() > vehicle.subscription.expiry) {
          vehicle.subscription.isActive = false;
          updated = true;
        }
      }
      if (updated) {
        await driver.save();
      }
    }
    console.log("Checked and updated expired subscriptions.");
  } catch (error) {
    console.error("Error checking subscription expiry:", error);
  }
};

cron.schedule('0 0 * * *', () => {
  console.log("Running daily subscription expiry check...");
  checkSubscriptionExpiry();
});

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
