// src/models/customer.model.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
  },
  disabilityStatus: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: Date,
    default: null,
  },
  deviceToken: { type: String, default: "" }, 


  // If you want to store hashed password for some reason
  password: { type: String, default: null },

}, { timestamps: true });

export default  mongoose.model('Customer', customerSchema)