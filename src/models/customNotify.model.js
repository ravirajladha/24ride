import mongoose from "mongoose";

const { Schema } = mongoose;

const customNotifySchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    notifyDriver: {
      type: Boolean,
      default: false,
    },
    notifyCustomer: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook to handle any additional operations before saving
customNotifySchema.pre("save", function (next) {
  // Add logic if necessary
  next();
});

const CustomNotify = mongoose.model("CustomNotify", customNotifySchema);

export default CustomNotify;
