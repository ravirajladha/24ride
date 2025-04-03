import CustomerLocationRepository from "../../repository/Customer/customerLocation.repository.js"
import { ApiError } from "../../utils/ApiError.js";

const updateCustomerLocation=async(customerId,lattitude,longitude)=>{
    const updateCustomer=await CustomerLocationRepository.updateCustomerLocationById(customerId,lattitude,longitude);
    if (!updateCustomer) {
        throw new ApiError(404, "Customer not found for location update");
      }
      return updateCustomer;
}

export default{updateCustomerLocation}