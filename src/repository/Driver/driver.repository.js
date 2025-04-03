import Driver from "../../models/driver.model.js";

 const insertDriver = async (driverData) => {
  try {
    // Create & save driver in MongoDB
    const newDriver = new Driver(driverData);
    const savedDriver = await newDriver.save();
    return savedDriver;
  } catch (error) {
    // e.g., duplicate key error if phone or email is already used
    throw error;
  }
};

 const findDriverByPhoneOrEmail = async (phoneNumber, email) => {
  return Driver.findOne({
    $or: [{ phoneNumber }, { email }],
  });
};


export default{
    insertDriver,
    findDriverByPhoneOrEmail
}