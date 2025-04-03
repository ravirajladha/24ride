import subscriptionRepository from '../../repository/Driver/subscription.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import moment from 'moment';

const getCurrentPlan = async (driverId) => {
  const subscription = await subscriptionRepository.findByDriverId(driverId);
  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }
  return subscription;
};

const updatePlan = async (driverId, planType) => {
  const currentSubscription = await subscriptionRepository.findByDriverId(driverId);

  // Check if the current plan is active
  if (currentSubscription && currentSubscription.isActive) {
    // Update plan only if current plan is active
    const updatedSubscription = await subscriptionRepository.updateSubscription(driverId, planType);
    return updatedSubscription;
  } else {
    // If the current plan is expired or inactive, create a new subscription
    const newSubscription = await subscriptionRepository.createNewSubscription(driverId, planType);
    return newSubscription;
  }
};

const createBasePlan = async (driverId) => {
    const endDate = moment().add(15, 'days').toDate(); // Base plan is 15 days
  
    const newSubscription = await subscriptionRepository.createNewSubscription(driverId, 'Base');
    return newSubscription;
  };

export default { getCurrentPlan, updatePlan,createBasePlan };
