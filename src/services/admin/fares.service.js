import faresRepository from "../../repository/Admin/fares.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const createOrUpdateFare = async (data) => {
  const existingFare = await faresRepository.findFareByCityId(data.city_id);

  if (existingFare) {
    // If the fare structure already exists, update it
    return await faresRepository.updateFare(data.city_id, data);
  } else {
    // If the fare structure doesn't exist, create a new one
    return await faresRepository.insertFare(data);
  }
};

export default {
  createOrUpdateFare,
};
