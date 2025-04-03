import mongoose from "mongoose";
import deleteAccountService from "../../services/customer/deleteAccount.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received ID:", id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid ObjectId format"));
        }
        const response = await deleteAccountService.deleteCustomerAccount (id);
        return res.status(200).json(new ApiResponse(200, response, "Account deleted successfully"));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
};

export default { deleteAccount };