import mongoose from "mongoose";

// Auto-rickshaw fare schema
const autoRickshawFareSchema = new mongoose.Schema({
  default_price: { type: Number, required: true },
  additional_fare_per_km: { type: Number, required: true },
  pickup_charge: { type: Number, required: true },
  night_fare_percentage: { type: Number, required: true },
  night_fare_time_range: {
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
});

// Cab fare schema
const cabFareSchema = new mongoose.Schema({
  sedan_fare: { type: Number, required: true },
  suv_fare: { type: Number, required: true },
  minivan_fare: { type: Number, required: true },
});

// Main fare structure schema
const fareSchema = new mongoose.Schema(
  {
    city_id: { type: String, required: true, unique: true }, // Reference to the city
    auto_rickshaw_fare: autoRickshawFareSchema,
    cab_fare: cabFareSchema,
    admin_modifiable_fields: {
      modify_fare_values: { type: Boolean, default: true },
      ride_acceptance_radius: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

export  default  mongoose.model("FareStructure", fareSchema);
