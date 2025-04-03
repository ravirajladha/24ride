import Feedback from "../../models/feedback.model.js";

const insertFeedback = async (data) => {
  return await Feedback.create(data);
};

const findAllFeedback = async () => {
  return await Feedback.find();
};

const findFeedbackById = async (id) => {
  return await Feedback.findById(id);
};


const countFeedbacks = async (filter) => {
  return Feedback.countDocuments(filter);
};

const filterFeedback = async (filter, skip, limit) => {
  return Feedback.find(filter).skip(skip).limit(limit);
};

const updateFeedbackStatus = async (id, status) => {
  return await Feedback.findByIdAndUpdate(id, { status }, { new: true });
};

const deleteFeedbackById=async(id)=>{
  return await Feedback.findByIdAndDelete(id)
  
}

const findFeedbacksByDriverId = async (driverId) => {
  return Feedback.find({ driverId }).exec();
};
export default {
  insertFeedback,
  findAllFeedback,
  findFeedbackById,
  updateFeedbackStatus,
  deleteFeedbackById,
  countFeedbacks,
  filterFeedback,
  findFeedbacksByDriverId
};