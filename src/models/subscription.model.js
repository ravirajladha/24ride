import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  planType: {
    type: String,
    enum: ['Base', 'Elite'],
    required: true,
    default: 'Base',
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
