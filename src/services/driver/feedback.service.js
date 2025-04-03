import feedbackRepository from "../../repository/Driver/feedback.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const createFeedback = async (data) => {
  if (!data.message || !data.feedbackType) {
    throw new ApiError(400, "Message and feedback type are required");
  }
  return await feedbackRepository.insertFeedback(data);
};

const getAllFeedback = async () => {
  return await feedbackRepository.findAllFeedback();
};

const getFeedbackById = async (id) => {
  const feedback = await feedbackRepository.findFeedbackById(id);
  if (!feedback) throw new ApiError(404, "Feedback not found");
  return feedback;
};

const countFeedbacks = async (filter) => {
  return feedbackRepository.countFeedbacks(filter);
};

const getFeedbackByFilter = async (filter, skip, limit) => {
  return feedbackRepository.filterFeedback(filter, skip, limit);
};


const updateFeedbackStatus = async (feedbackId, status) => {
  const updatedFeedback = await feedbackRepository.updateFeedbackStatus(
    feedbackId, 
    status , 
   
  );

  return updatedFeedback;
};

const deleteFeedbackByid=async(id)=>{
  const deletefeed = await feedbackRepository.deleteFeedbackById(id)
    if (!deletefeed) {
      throw new ApiError(404, "not found");
    }
    return{message:"deleted successfully"};
}
const getFeedbacksByDriverId = async (driverId) => {
  return await feedbackRepository.findFeedbacksByDriverId(driverId);
};

export default {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  updateFeedbackStatus,
  deleteFeedbackByid,
  countFeedbacks,
  getFeedbackByFilter,
  getFeedbacksByDriverId
};
