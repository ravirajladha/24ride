import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: function () {
        return this.feedbackType === "driver"; 
      },
    },
    customerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: function () {
        return this.feedbackType === "customer"; 
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    feedbackType: {
      type: String,
      enum: ["driver", "customer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
  },
  { timestamps: true } 
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
