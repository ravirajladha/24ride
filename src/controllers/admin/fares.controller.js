import faresService from "../../services/admin/fares.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Create or update fare structure for a specific city
 const createOrUpdateFare = async (req, res) => {
  try {
    const fareData = req.body;
    const cityFare = await faresService.createOrUpdateFare(fareData);
    return res
      .status(201)
      .json(new ApiResponse(201, cityFare, "Fare structure created/updated successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("createOrUpdateFare error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};


export default{
    createOrUpdateFare
}