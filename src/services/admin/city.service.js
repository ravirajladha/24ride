// services/admin/city.service.js

import cityModel from "../../models/city.model.js";
import cityRepository from "../../repository/Admin/city.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const createCity = async (data) => {
  // Check if cityCode already exists
  const existing = await cityRepository.findCityByCityCode(data.cityCode);
  if (existing) {
    throw new ApiError(409, "City with this cityCode already exists");
  }
  return await cityRepository.insertCity(data);
};

const getCityById = async (id) => {
  const city = await cityRepository.findCityById(id);
  if (!city) {
    throw new ApiError(404, "City not found");
  }
  return city;
};

const getAllCities = async () => {
  return await cityRepository.findAllCities();
};

const updateCity = async (id, updateData) => {
  const updatedCity = await cityRepository.updateCityById(id, updateData);
  if (!updatedCity) {
    throw new ApiError(404, "City not found for update");
  }
  return updatedCity;
};

const deleteCity = async (id) => {
  const deletedCity = await cityRepository.deleteCityById(id);
  if (!deletedCity) {
    throw new ApiError(404, "City not found for deletion");
  }
  return deletedCity;
};
const findAllCities = async () => {
  return await cityModel.find().sort({ createdAt: -1 }).select("cityName");
};

export default {
  createCity,
  getCityById,
  getAllCities,
  updateCity,
  deleteCity,
};
