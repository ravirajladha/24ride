import Subscription from "../../models/subscription.model.js";
import moment from "moment";

const findByDriverId = async (driverId) => {
  return await Subscription.findOne({ driverId }).sort({ createdAt: -1 }); // Sort by most recent
};

const updateSubscription = async (driverId, planType) => {
  const endDate = planType === 'Elite' ? moment().add(1, 'months').toDate() : moment().add(15, 'days').toDate();
  const updatedSubscription = await Subscription.findOneAndUpdate(
    { driverId },
    {
      planType,
      startDate: new Date(),
      endDate,
      isActive: true,
    },
    { new: true }
  );
  return updatedSubscription;
};

const createNewSubscription = async (driverId, planType) => {
    // Set end date based on the plan type
    let endDate;
    if (planType === 'Elite') {
      endDate = moment().add(1, 'months').toDate(); // Elite plan is for 1 month
    } else if (planType === 'Base') {
      endDate = moment().add(15, 'days').toDate(); // Base plan is for 15 days
    } else {
      throw new Error("Invalid plan type");
    }
  
    // Create a new subscription with the given planType and endDate
    const newSubscription = await Subscription.create({
      driverId,
      planType,
      startDate: new Date(), // Subscription starts immediately
      endDate,
      isActive: true, // Subscription is active by default
    });
  
    return newSubscription;
  };

export default { findByDriverId, updateSubscription, createNewSubscription };
