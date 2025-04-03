import customNotifyRepository from "../../repository/Admin/customNotify.repository.js";

const customNotify = async (notifyDriver, notifyCustomer, message) => {
  return await customNotifyRepository.customNotify(notifyDriver, notifyCustomer, message);
};

const getAllCustomNotifyService = async (page, limit) => {
  return await customNotifyRepository.getAllCustomNotifyRepo(page, limit);
};

const deleteCustomNotifyService = async (id) => {
  try {
    const deletedNotification = await customNotifyRepository.deleteCustomNotifyRepo(id);

    if (!deletedNotification) {
      throw new Error("Notification not found");
    }

    return deletedNotification;
  } catch (error) {
    throw new Error("Error in deleteCustomNotifyService: " + error.message);
  }
};

export default {
  customNotify,
  getAllCustomNotifyService,
  deleteCustomNotifyService,
};
