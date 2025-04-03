import Driver from "../../models/driver.model.js";
import DriverVerification from "../../models/driverVerification.model.js";
import Customer from "../../models/customer.model.js";

const getDriverCounts = async (city) => {
    try {
        const cityFilter = city ? { city } : {}; 
        const [totalCustomers,totalDrivers, rejectedDrivers, acceptedDrivers, pendingDrivers] = await Promise.all([
            Customer.countDocuments(),
            Driver.countDocuments(cityFilter),
            DriverVerification.countDocuments({ ...cityFilter ,verificationStatus: "rejected" }),
            DriverVerification.countDocuments({ ...cityFilter ,verificationStatus: "verified" }),
            DriverVerification.countDocuments({ ...cityFilter ,verificationStatus: "pending" })
        ]);

        return {
            cityFilter,
            totalCustomers,
            totalDrivers,
            rejectedDrivers,
            acceptedDrivers,
            pendingDrivers
        };
    } catch (error) {
        console.error("Error fetching driver counts:", error);
        throw new Error("Failed to fetch driver counts");
    }
};

export default  { getDriverCounts };
