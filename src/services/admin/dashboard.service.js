
import dashboardRepository from "../../repository/Admin/dashboard.repository.js";


const getAllDrivers = async (city) => {
    return await dashboardRepository.getDriverCounts(city);
};

export default {
     getAllDrivers
 }