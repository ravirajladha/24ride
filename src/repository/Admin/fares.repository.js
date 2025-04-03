import FareStructure from "../../models/fares.model.js";

const insertFare = async (data) => {
  const newFare = new FareStructure(data);
  return await newFare.save();
};




const findFareByCityId = async (cityId) => {
  return await FareStructure.findOne({ city_id: cityId });
};

const updateFare = async (cityId, data) => {
  return await FareStructure.findOneAndUpdate({ city_id: cityId }, data, {
    new: true, // Return the updated document
  });
};

export default {
  insertFare,
  findFareByCityId,
  updateFare,
};
