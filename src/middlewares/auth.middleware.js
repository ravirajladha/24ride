// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Example: If you want to do a single "User" collection with a "role" field
// Or you can do separate models and fetch them individually (shown below).
import Admin from "../models/admin.model.js";
import Driver from "../models/driver.model.js";
import Customer from "../models/customer.model.js";

/**
 * verifyJWT
 *  - Checks for a JWT token in Authorization headers.
 *  - Decodes token, finds user in DB (admin/driver/customer).
 *  - Attach user to req.user.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Check token in headers: "Authorization: Bearer <token>"
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    throw new ApiError(401, "Missing Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const { userId, role } = decoded; // We assume we stored userId + role in token
console.log( 'kk',userId, role );

  // Find user in the relevant model
  let user;
  if (role === "admin") {
    user = await Admin.findById(userId);
  } else if (role === "driver") {
    user = await Driver.findById(userId);
  } else if (role === "customer") {
    user = await Customer.findById(userId);
  }

  if (!user) {
    throw new ApiError(401, "User not found or inactive");
  }

  // Attach user + role to request
  req.user = user;
  req.userRole = role;

  return next();
});

/**
 * verifyRole
 *  - A middleware factory to check if the user has one of the allowed roles
 *  - E.g. verifyRole("admin") => only admin can access route
 */
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.userRole)) {
      throw new ApiError(403, "Forbidden: Insufficient permissions");
    }
    next();
  };
};
