import { asyncHandler } from "../../utils/asyncHandler.js";
import customNotifyService from "../../services/admin/customNotify.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const customNotify = asyncHandler(async (req, res) => {
  try {
    // Destructure values from req.body
    const { notifyDriver, notifyCustomer, message } = req.body;

    // Call the service to create the notification
    await customNotifyService.customNotify(notifyDriver, notifyCustomer, message);

    // Use ApiResponse to send a success message
    return res.status(200).json(
      new ApiResponse(200, null, "Custom notification sent successfully")
    );
  } catch (error) {
    // Use ApiError to send an error message
    const apiError = new ApiError(500, "Error sending custom notification", [error.message]);
    return res.status(500).json(apiError);
  }
});

const getAllCustomNotify = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const { notifications, totalCount } = await customNotifyService.getAllCustomNotifyService(page, limit);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json(
      new ApiResponse(200, notifications, "Notifications fetched successfully", {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
      })
    );
  } catch (error) {
    const apiError = new ApiError(500, "Error fetching notifications", [error.message]);
    return res.status(500).json(apiError);
  }
});

const deleteCustomNotify = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await customNotifyService.deleteCustomNotifyService(id);

    return res.status(200).json(
      new ApiResponse(200, deletedNotification, "Notification deleted successfully")
    );
  } catch (error) {
    const apiError = new ApiError(400, "Failed to delete notification", [error.message]);
    return res.status(400).json(apiError);
  }
});

export default {
  customNotify,
  getAllCustomNotify,
  deleteCustomNotify,
};
