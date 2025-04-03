import { model } from "mongoose";
import CabSubscription from "../../models/CabSubscription.model.js";
import AutoSubscription from "../../models/autoSubscription.model.js";

const createCabSubscription = async (subscriptionData) => {
  return await CabSubscription.create(subscriptionData);
};

const findCabSubscriptionById = async (planId) => {
  return await CabSubscription.findById(planId);
};

const updateCabSubscription = async (planId, monthlySubscriptionPrice) => {
  console.log('repo', planId, monthlySubscriptionPrice);

  // Check the type of monthlySubscriptionPrice

  // If it's an object, let's log its structure and flatten it.
  if (typeof monthlySubscriptionPrice === 'object' && monthlySubscriptionPrice !== null) {
    console.log('Flattening monthlySubscriptionPrice');
    // If it's an object, attempt to flatten it
    monthlySubscriptionPrice = monthlySubscriptionPrice.monthlySubscriptionPrice || monthlySubscriptionPrice;
  }

  // Ensure the value is a number
  const price = Number(monthlySubscriptionPrice);
  console.log('Converted price:', price);

  if (isNaN(price)) {
    throw new Error('Invalid monthlySubscriptionPrice');
  }

  return await CabSubscription.findByIdAndUpdate(
    planId,
    { $set: { monthlySubscriptionPrice: price } },
    { new: true }
  );
};


const deleteCabSubscription = async (planId) => {
  return await CabSubscription.findByIdAndDelete(planId);
};

const findAllCabSubscriptions = async () => {
  return await CabSubscription.find({});
};

//Auto Subscription
const insertAutoSubscription = async (data) => {
  return await AutoSubscription.create(data);
};

// Find an auto subscription by its ID
const findAutoSubscriptionById = async (id) => {
  return await AutoSubscription.findById(id);
};

// Update an auto subscription's details by its ID
const updateAutoSubscription = async (id, data) => {
  return await AutoSubscription.findByIdAndUpdate(id, data, { new: true });
};

// Delete an auto subscription by its ID
const deleteAutoSubscriptionById = async (id) => {
  return await AutoSubscription.findByIdAndDelete(id);
};

// Find all auto subscriptions
const findAllAutoSubscriptions = async () => {
  return await AutoSubscription.find();
};


export const cabSubscriptionRepository = {
  createCabSubscription,
  findCabSubscriptionById,
  updateCabSubscription,
  deleteCabSubscription,
  findAllCabSubscriptions,

  insertAutoSubscription,
  findAutoSubscriptionById,
  updateAutoSubscription,
  deleteAutoSubscriptionById,
  findAllAutoSubscriptions
};
