import customerModel from "../../models/customer.model.js";

// Function to find customer by ID
const findCustomerById = async (id) => {
    return await customerModel.findById(id);
};

// Function to delete customer by ID
const deleteAccById = async (id) => {
    return await customerModel.findByIdAndDelete(id);
};

export default { findCustomerById, deleteAccById };