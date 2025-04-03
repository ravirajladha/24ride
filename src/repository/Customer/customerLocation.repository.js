import Customer from "../../models/customer.model.js"

const updateCustomerLocationById = async (_id, latitude, longitude) => {
  return await Customer.findByIdAndUpdate(
  _id, { latitude, longitude }, { new: true } 
  );
};

export default {updateCustomerLocationById}