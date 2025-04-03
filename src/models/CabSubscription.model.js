import mongoose, { Schema } from 'mongoose';

const cabSubscriptionSchema = new Schema({
  seatingCapacity: { 
    type: String,
    enum: ['0-5 Seater', '6-10 Seater', '11-17 Seater', 'More than 18 Seater'],
    required: true,
  },
  monthlySubscriptionPrice: {
    type: Number,
    required: true, // Admin can edit the price here
  },
  isActive: { 
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const CabSubscription = mongoose.model('CabSubscription', cabSubscriptionSchema);

export default CabSubscription;
