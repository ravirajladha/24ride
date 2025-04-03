import updateCustomerLocationService from "../../services/customer/customerLocation.service.js"
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const updateLocation = async (req, res) => {
    try {
   
      const { latitude, longitude,id } = req.body;
  
      if (!latitude || !longitude) {
        throw new ApiError(400, "Latitude and Longitude are required");
      }
  
      const updatedCustomerLoc = await updateCustomerLocationService.updateCustomerLocation(id, latitude, longitude);
  
      return res.status(200).json(new ApiResponse(200, updatedCustomerLoc, "Customer location updated successfully"));
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      }
      console.error(" error:", error);
      return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
  };
  export default{updateLocation}