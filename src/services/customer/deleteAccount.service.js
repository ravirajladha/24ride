import deleteAccountRepository from "../../repository/Customer/deleteAccount.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const deleteCustomerAccount = async (id) => {
    console.log("Checking user with ID:", id); // Debugging log

    const userExists = await deleteAccountRepository.findCustomerById(id);
    if (!userExists) {
        throw new ApiError(404, "Customer not found");
    }

    // Delete customer account
    const deletedAccount = await deleteAccountRepository.deleteAccById(id);
    if (!deletedAccount) {
        throw new ApiError(500, "Error deleting account");
    }

    return { message: "Deleted successfully" };
};

export default { deleteCustomerAccount };