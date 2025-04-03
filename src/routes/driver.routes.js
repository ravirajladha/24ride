import { Router } from "express";
import { sendOtp,verifyOtpAndLogin,deleteDriverAccount,getDriverProfile } from "../controllers/auth.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import driverVerificationController from "../controllers/driver/driverVerification.controller.js";
import cityController from "../controllers/admin/city.controller.js";
import subscriptionController from "../controllers/driver/subscription.controller.js";
import feedbackController from "../controllers/driver/feedback.controller.js";
import addVehicleController from "../controllers/driver/addVehicle.controller.js";
const router = Router();

// Driver Verification (instead of register)
router.post(
  "/verify",
  upload.any(),
  driverVerificationController.createDriverVerification
);


// Driver login route
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);
//get all cities 
router.get("/get-cities", cityController.getAllCities);





// Driver Verification (instead of register)
router.post(
  "/verify",
  // Use `upload.any()` or a similar approach so you get *all* files
  upload.any(),
  (req, res, next) => {
    logger.info("Driver verification request received");
    next();
  },
  driverVerificationController.createDriverVerification
);


// Driver login route
router.post("/send-otp", (req, res, next) => {
  logger.info('Send OTP request received');
  next();
}, sendOtp);
router.post("/verify-otp", (req, res, next) => {
  logger.info('Verify OTP request received');
  next();
}, verifyOtpAndLogin);




// Protect driver routes
router.use(verifyJWT, verifyRole("driver"));


//update-location
router.put("/update-location", driverVerificationController.updateDriverLocation);
//driver delete account
router.delete("/driver-delete", deleteDriverAccount);
router.get("/profile", getDriverProfile);


//update-subscription-plan
router.put("/update-plan", subscriptionController.updatePlan);
router.get("/get-current-plan/:driverId", subscriptionController.getCurrentPlan);


//dRIVER FEEDBACK
router.use("/add-feedback",feedbackController.createFeedback)
router.get("/get-feedback/:driverId",feedbackController.getFeedbacksByDriverId)

//add vehicles
router.post("/Addvheicle", addVehicleController.addVehicle);
router.get("/get-vehicle/:driverId",addVehicleController.getAddedVehiclesByDriverId)



router.get("/profile", (req, res) => {
  return res.json({ message: "Driver profile data", user: req.user });
});


export default router;
