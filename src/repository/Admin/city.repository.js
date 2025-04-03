// repository/Admin/city.repository.js

import City from "../../models/city.model.js";

const insertCity = async (data) => {
  return await City.create(data);
};

const findCityById = async (id) => {
  return await City.findById(id);
};

const findCityByCityCode = async (cityCode) => {
  return await City.findOne({ cityCode });
};

const findAllCities = async () => {
  return await City.find().sort({ createdAt: -1 });
};

const updateCityById = async (id, updateData) => {
  return await City.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteCityById = async (id) => {
  return await City.findByIdAndDelete(id);
};

export default {
  insertCity,
  findCityById,
  findCityByCityCode,
  findAllCities,
  updateCityById,
  deleteCityById,
};
