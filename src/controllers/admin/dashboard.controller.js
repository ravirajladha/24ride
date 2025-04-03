import { ApiResponse } from "../../utils/ApiResponse.js";
import dashboardService from "../../services/admin/dashboard.service.js";

const getAllDrivers = async (req, res) => {
    try {
        const {city} = req.query;
        const count = await dashboardService.getAllDrivers(city);
        return res.status(200).json(new ApiResponse(200, { totalDrivers: count }, "Total number of drivers"));
    } catch (error) {
        console.error("Error in getAllDrivers:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
};

export default {
    getAllDrivers
}