import mongoose from "mongoose";

const addVehicleSchema = new mongoose.Schema(
  {
    driverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Driver", // Reference to the Driver model 
      required: true 
    },
    vehicleNumber: { 
      type: String, 
      required: true 
    },
    vehicleModel: { 
      type: String, 
      default: "" 
    },
    vehicleName: { 
      type: String, 
      required: true 
    },
    seatingCapacity: { 
      type: Number, 
      default: 0 
    },
    verificationStatus: { 
      type: String, 
      enum: ["pending", "verified", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// Middleware to populate driver details on `find` and `findOne` queries
addVehicleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "driverId", 
    select: "name email phoneNumber gender city profileImage" // Selecting specific fields
  });
  next();
});

export default mongoose.model("AddVehicle", addVehicleSchema);
