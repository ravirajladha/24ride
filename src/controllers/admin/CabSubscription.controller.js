import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import cabSubscriptionService from "../../services/admin/CabSubscription.service.js";


const createCabSubscription = asyncHandler(async (req, res) => {
  const { seatingCapacity, monthlySubscriptionPrice } = req.body;

  try {
    const subscription = await cabSubscriptionService.createCabSubscription({
      seatingCapacity,
      monthlySubscriptionPrice,
    });
    return res.status(200).json(new ApiResponse(200, subscription, "Subscription plan created successfully"));
  } catch (err) {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null, err.message));
  }
});

const updateCabSubscription = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const { monthlySubscriptionPrice } = req.body;

  console.log("Received data:", req.body);  // Log the incoming request body for debugging

  try {
    const subscription = await cabSubscriptionService.updateCabSubscription(planId, monthlySubscriptionPrice);
    return res.status(200).json(new ApiResponse(200, subscription, "Subscription plan updated successfully"));
  } catch (err) {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null, err.message));
  }
});


const deleteCabSubscription = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  try {
    await cabSubscriptionService.deleteCabSubscription(planId);
    return res.status(200).json(new ApiResponse(200, planId, "Subscription plan deleted successfully"));
  } catch (err) {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null, err.message));
  }
});

const getCabSubscriptionById = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  try {
    const subscription = await cabSubscriptionService.getCabSubscriptionById(planId);
    return res.status(200).json(new ApiResponse(200, subscription, "Subscription plan details retrieved successfully"));
  } catch (err) {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null, err.message));
  }
});

const getAllCabSubscriptions = asyncHandler(async (req, res) => {
  try {
    const subscriptions = await cabSubscriptionService.getAllCabSubscriptions();
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscription plans retrieved successfully"));
  } catch (err) {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null, err.message));
  }
});

// auto subscription


const addAutoSubscription = async (req, res) => {
  try {
    const autoSubscription = await cabSubscriptionService.addAutoSubscription(req.body);
    res.status(201).json(new ApiResponse(201, autoSubscription, "Auto Subscription Created Successfully"));
  } catch (error) {
    res.status(error.status || 500).json(new ApiResponse(500, null, error.message || "Internal Server Error"));
  }
};

// Update an existing auto subscription
const updateAutoSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAutoSubscription = await cabSubscriptionService.updateAutoSubscription(id, req.body);
    res.status(200).json(new ApiResponse(200, updatedAutoSubscription, "Auto Subscription Updated Successfully"));
  } catch (error) {
    res.status(error.status || 500).json(new ApiResponse(500, null, error.message || "Internal Server Error"));
  }
};

// Delete an auto subscription by ID
const deleteAutoSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cabSubscriptionService.deleteAutoSubscription(id);
    res.status(200).json(new ApiResponse(200, result, "Auto Subscription Deleted Successfully"));
  } catch (error) {
    res.status(error.status || 500).json(new ApiResponse(500, null, error.message || "Internal Server Error"));
  }
};

// Get all auto subscriptions
const getAllAutoSubscriptions = async (req, res) => {
  try {
    const autoSubscriptions = await cabSubscriptionService.getAllAutoSubscriptions();
    res.status(200).json(new ApiResponse(200, autoSubscriptions, "Auto Subscriptions Fetched Successfully"));
  } catch (error) {
    res.status(error.status || 500).json(new ApiResponse(500, null, error.message || "Internal Server Error"));
  }
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
