import CustomNotify from "../../models/customNotify.model.js";
import  Driver  from "../../models/driver.model.js";
import Customer from "../../models/customer.model.js";
import { sendBulkPushNotifications } from "../../utils/pushNotification.js";

const customNotify = async (notifyDriver, notifyCustomer, message) => {
  // Notify all drivers if notifyDriver === true
  if (notifyDriver) {
    const drivers = await Driver.find({}).select('_id deviceToken');
    const driverTokens = drivers.map(driver => driver.deviceToken).filter(Boolean);

    if (driverTokens.length > 0) {
      await sendBulkPushNotifications(driverTokens, message, 'driver');
    }
  }

  // Notify all customers if notifyCustomer === true
  if (notifyCustomer) {
    const customers = await Customer.find({}).select('_id deviceToken');
    const customerTokens = customers.map(customer => customer.deviceToken).filter(Boolean);

    if (customerTokens.length > 0) {
      await sendBulkPushNotifications(customerTokens, message, 'customer');
    }
  }

  const savedBroadcast = await CustomNotify.create({
    message,
    notifyDriver,
    notifyCustomer
  });

  return { success: true, notifyDriver, notifyCustomer, message, savedBroadcast };
};

const getAllCustomNotifyRepo = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await CustomNotify.countDocuments();
  const notifications = await CustomNotify.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    notifications,
    totalCount,
  };
};

const deleteCustomNotifyRepo = async (id) => {
  try {
    const deletedNotification = await CustomNotify.findByIdAndDelete(id);
    return deletedNotification;
  } catch (error) {
    throw new Error("Error deleting custom notification: " + error.message);
  }
};

export default {
  customNotify,
  getAllCustomNotifyRepo,
  deleteCustomNotifyRepo,
};
