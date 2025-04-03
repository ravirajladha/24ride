import driverRepository from "../../repository/Driver/driver.repository.js";
import { ApiError } from "../../utils/ApiError.js";

 const createNewDriver = async (driverData) => {
  // Check if driver with same phone/email already exists
  const existingDriver = await driverRepository.findDriverByPhoneOrEmail(driverData.phoneNumber, driverData.email);
  if (existingDriver) {
    throw new ApiError(409, "Driver with this phone or email already exists.");
  }

  // Insert new driver
  const savedDriver = await driverRepository.insertDriver(driverData);
  return savedDriver;
};
export default{
    createNewDriver
}
