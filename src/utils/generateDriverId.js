import Driver from "../models/driver.model.js";

import City from "../models/city.model.js";
/**
 * Generate a unique driverId, e.g. "BLR07022025D1".
 * @param {string} cityName - Full city name like "Bangalore"
 * @param {Date} date - Current date (defaults to now)
 */
export const generateDriverId = async (cityName, date = new Date()) => {
  // 1. Query the City collection to get the city code dynamically
  const city = await City.findOne({ cityName });

  // 2. If city not found, use fallback code "XXX"
  const cityCode = city ? city.cityCode : "XXX"; 

  // 3. Format date as ddmmyyyy
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const dateString = `${dd}${mm}${yyyy}`; // e.g. "07022025"

  // 4. Build prefix, e.g. "BLR07022025D"
  const prefix = `${cityCode}${dateString}D`;

  // 5. Count how many drivers already have that prefix
  const existingDrivers = await Driver.find({
    driverId: { $regex: `^${prefix}` },
  });

  // 6. The next sequence is existingDrivers.length + 1
  const sequence = existingDrivers.length + 1;

  // 7. Return final ID: e.g. "BLR07022025D1"
  return `${prefix}${sequence}`;
};