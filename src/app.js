import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";

// Import Routes
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import customerRoutes from "./routes/customer.routes.js";

dotenv.config();
const app = express();

// CORS Configuration
const allowedOrigins = [process.env.CORS_ORIGIN, "https://24rides.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60, // 1 hour session expiry
      autoRemove: "native",
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);


// Routes
app.use("/admin", adminRoutes);
app.use("/driver", driverRoutes);
app.use("/customer", customerRoutes);

export { app };
