import feedbackService from "../../services/driver/feedback.service.js";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/ApiResponse.js";


const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(201).json(new ApiResponse(201,feedback,'Feedback Created successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500,null,"internal server error"));
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedback();
    res.status(200).json(new ApiResponse(200,feedbacks,"fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500,null,"internal server error"));
  }
};


const getFeedbackById = async (req, res) => {
    try {
      const feedback = await feedbackService.getFeedbackById(req.params.feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(200).json(feedback);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
}

const getFilteredFeedbacks = async (req, res) => {
  try {
    const { feedbackType } = req.params;
    const { status, page, limit} = req.query;

    let filter = { feedbackType };
    if (status && status !== "all") {
      filter.status = status;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const feedbacks = await feedbackService.getFeedbackByFilter(filter, skip, limitNumber);
    const totalFeedbacks = await feedbackService.countFeedbacks(filter);
    // console.log("total pages",Math.ceil(totalFeedbacks / limitNumber));
    
    res.status(200).json(new ApiResponse(200, {
      feedbacks,
    }, "Feedbacks fetched successfully",
    {totalFeedbacks,
    totalPages: Math.ceil(totalFeedbacks / limitNumber),
    currentPage: pageNumber}));
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};


const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    // console.log("Request Params:", req.params); 
    // console.log("Request Body:", req.body);

   
    if (!["read", "unread"].includes(status)) {
      return res.status(400).json(new ApiResponse(400,null,"clent side error"));
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      
      return res.status(400).json(new ApiResponse(400,null,"invalid Id format"));
    }
    const updatedFeedback = await feedbackService.updateFeedbackStatus(id, status);
    if (!updatedFeedback) {
      return res.status(404).json(new ApiResponse(404,null,"feedback not found"));
    }
    res.status(200).json(new ApiResponse(200,updatedFeedback,"Updated successfully"));
  } catch (error) {
    console.error("Error", error);
    res.status(500).json(new ApiResponse(500,null,"internal server Error"));
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await feedbackService.deleteFeedbackByid(id)

    res.status(200).json(new ApiResponse(200,"Deleted Successfully")); 
  } catch (error) {
    res.status(404).json(new ApiResponse(404,null,"error occurred"));
  }
};

const getFeedbacksByDriverId = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid driver ID format"));
    }

    const feedbacks = await feedbackService.getFeedbacksByDriverId(driverId);
    
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, "No feedback found for this driver"));
    }
    
    res.status(200).json(new ApiResponse(200, feedbacks, "Feedbacks fetched successfully"));
  } catch (error) {
    console.error("Error fetching feedbacks for driver:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};



export default{createFeedback,getAllFeedback,updateFeedbackStatus,getFeedbackById,
  deleteFeedback,getFilteredFeedbacks,

  getFeedbacksByDriverId}