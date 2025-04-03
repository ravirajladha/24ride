import { ApiError } from "../../utils/ApiError.js";
import { cabSubscriptionRepository } from "../../repository/Admin/cabSubscription.repository.js";

const createCabSubscription = async (subscriptionData) => {
  return await cabSubscriptionRepository.createCabSubscription(subscriptionData);
};

const updateCabSubscription = async (planId, monthlySubscriptionPrice) => {
  console.log('servi',planId, monthlySubscriptionPrice);
  
  const existingPlan = await cabSubscriptionRepository.findCabSubscriptionById(planId);
  if (!existingPlan) {
    throw new ApiError(404, "Subscription plan not found");
  }

  // Pass monthlySubscriptionPrice directly as a number, not an object
  return await cabSubscriptionRepository.updateCabSubscription(planId, { monthlySubscriptionPrice });
};



const deleteCabSubscription = async (planId) => {
  const plan = await cabSubscriptionRepository.findCabSubscriptionById(planId);
  if (!plan) {
    throw new ApiError(404, "Subscription plan not found");
  }
  return await cabSubscriptionRepository.deleteCabSubscription(planId);
};

const getCabSubscriptionById = async (planId) => {
  const plan = await cabSubscriptionRepository.findCabSubscriptionById(planId);
  if (!plan) {
    throw new ApiError(404, "Subscription plan not found");
  }
  return plan;
};

const getAllCabSubscriptions = async () => {
  return await cabSubscriptionRepository.findAllCabSubscriptions();
};
//Auto subscription
const addAutoSubscription = async (data) => {
  console.log(data);
  
  if (!data.planName || data.price === undefined || data.duration === undefined) {
    console.log('Validation failed'); // Log if validation failed
    throw new ApiError(400, "Plan name, price, and duration are required");
  }
  return await cabSubscriptionRepository.insertAutoSubscription(data);
};

// Update an existing auto subscription
const updateAutoSubscription = async (id, data) => {
  const existingSubscription = await cabSubscriptionRepository.findAutoSubscriptionById(id);
  
  if (!existingSubscription) {
    throw new ApiError(404, "Auto Subscription not found");
  }
  
  return await cabSubscriptionRepository.updateAutoSubscription(id, data);
};

// Delete an auto subscription by its ID
const deleteAutoSubscription = async (id) => {
  const existingSubscription = await cabSubscriptionRepository.findAutoSubscriptionById(id);
  
  if (!existingSubscription) {
    throw new ApiError(404, "Auto Subscription not found");
  }
  
  await cabSubscriptionRepository.deleteAutoSubscriptionById(id);
  return { message: "Auto subscription deleted successfully" };
};

// Get all auto subscriptions
const getAllAutoSubscriptions = async () => {
  return await cabSubscriptionRepository.findAllAutoSubscriptions();
};


export default {
  createCabSubscription,
  updateCabSubscription,
  deleteCabSubscription,
  getCabSubscriptionById,
  getAllCabSubscriptions,

  addAutoSubscription,
  updateAutoSubscription,
  deleteAutoSubscription,
  getAllAutoSubscriptions
};
