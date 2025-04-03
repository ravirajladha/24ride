import mongoose, { Schema } from 'mongoose';

const autoSubscriptionSchema = new Schema({
  planName: { 
    type: String,
    enum: ['Basic Plan', 'Elite Plan'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Duration in days
  },
  isActive: { 
    type: Boolean,
    default: true,
  },
}, { timestamps: true });



// Create the model for AutoSubscription
const AutoSubscription = mongoose.model('AutoSubscription', autoSubscriptionSchema);



export default AutoSubscription;
