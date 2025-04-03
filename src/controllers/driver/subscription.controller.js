import subscriptionService from '../../services/driver/subscription.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

const getCurrentPlan = async (req, res) => {
  try {
    const { driverId } =  req.params
    const subscription = await subscriptionService.getCurrentPlan(driverId);

    if (!subscription) {
      return res.status(404).json(new ApiResponse(404, null, "Subscription not found"));
    }

    return res.status(200).json(new ApiResponse(200, subscription, "Current subscription plan fetched successfully"));
  } catch (error) {
    console.error("getCurrentPlan error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const updatePlan = async (req, res) => {
  try {
  
    const { planType,driverId } = req.body; // 'Base' or 'Elite'

    if (!planType) {
      return res.status(400).json(new ApiResponse(400, null, "Plan type is required"));
    }

    const updatedSubscription = await subscriptionService.updatePlan(driverId, planType);

    return res.status(200).json(new ApiResponse(200, updatedSubscription, "Subscription plan updated successfully"));
  } catch (error) {
    console.error("updatePlan error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export default { getCurrentPlan, updatePlan };
