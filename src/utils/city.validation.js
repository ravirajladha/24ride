// validations/city.validation.js

import Joi from "joi";


// For bounding box
const boundingBoxSchema = Joi.object({
  northeast: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }),
  southwest: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }),
});

// For fares
const fareSchema = Joi.object({
  baseFare: Joi.number().default(0),
  perKmFare: Joi.number().default(0),
  pickupCharge: Joi.number().default(0),
  nightSurge: Joi.number().default(0),
});

/**
 * Validation schema for creating a city
 */
export const createCitySchema = Joi.object({
  cityName: Joi.string().required(),
  cityCode: Joi.string().required(),
  state: Joi.string().required(),
  latitude: Joi.number().default(0),
  longitude: Joi.number().default(0),
  postalCodes: Joi.array().items(Joi.string()).optional(),
  boundingBox: boundingBoxSchema.optional(),
  
  fares: Joi.object({
    auto: fareSchema.default(),
    outstation: fareSchema.default(),
  }).default(),
});

/**
 * Validation schema for updating a city
 */
export const updateCitySchema = Joi.object({
  cityName: Joi.string().optional(),
  cityCode: Joi.string().optional(),
  state: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  postalCodes: Joi.array().items(Joi.string()).optional(),
  boundingBox: boundingBoxSchema.optional(),

  fares: Joi.object({
    auto: fareSchema,
    outstation: fareSchema,
  }).optional(),
});
