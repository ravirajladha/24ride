// controllers/admin/city.controller.js

import cityService from "../../services/admin/city.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Import the Joi validation schemas
import {
  createCitySchema,
  updateCitySchema,
} from "../../utils/city.validation.js";

/**
 * Create City
 */
const createCity = async (req, res) => {
  try {
    // Validate req.body with Joi
    const { error, value } = createCitySchema.validate(req.body);
    if (error) {
      // If validation fails, throw 400 error with message
      throw new ApiError(400, error.details[0].message);
    }

    // Use validated "value" instead of raw "req.body"
    const newCity = await cityService.createCity(value);
    return res
      .status(201)
      .json(new ApiResponse(201, newCity, "City created successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("createCity error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

/**
 * Get City by ID
 */
const getCity = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await cityService.getCityById(id);
    return res
      .status(200)
      .json(new ApiResponse(200, city, "City fetched successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("getCity error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

/**
 * Get All Cities
 */
const getAllCities = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    return res
      .status(200)
      .json(new ApiResponse(200, cities, "Cities fetched successfully"));
  } catch (error) {
    console.error("getAllCities error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

/**
 * Update City
 */
const updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate req.body with Joi for updates
    const { error, value } = updateCitySchema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const updated = await cityService.updateCity(id, value);
    return res
      .status(200)
      .json(new ApiResponse(200, updated, "City updated successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("updateCity error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

/**
 * Delete City
 */
const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await cityService.deleteCity(id);
    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "City deleted successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error("deleteCity error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};
const getAllCitiesDashboard = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    const cityNames = cities.map((city) => city.cityName); 

    return res
      .status(200)
      .json(new ApiResponse(200, cityNames, "Cities fetched successfully"));
  } catch (error) {
    console.error("getAllCities error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};


export default {
  getAllCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
  getAllCitiesDashboard
};
