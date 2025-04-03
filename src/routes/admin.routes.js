import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import driverVerificationAdminController from "../controllers/admin/driverVerificationAdmin.controller.js";
import cityController from "../controllers/admin/city.controller.js";
import { getAllStates, getCitiesForState } from "../controllers/admin/stateCity.controller.js";
import faresController from "../controllers/admin/fares.controller.js";
import feedbackController from "../controllers/driver/feedback.controller.js";
import customNotifyController from "../controllers/admin/customNotify.controller.js";
import dashboardController from "../controllers/admin/dashboard.controller.js";
import CabSubscriptionController from "../controllers/admin/CabSubscription.controller.js";
import addVehicleController from "../controllers/driver/addVehicle.controller.js";

const router = Router();

// Admin login route
router.post("/login", adminLogin);

// Protect all subsequent admin routes
router.use(verifyJWT, verifyRole("admin"));

// Admin endpoints for driver verifications
router.get("/driver-verifications", driverVerificationAdminController.getAllVerifications);
router.post("/driver-verifications/approve", driverVerificationAdminController.approveVerification);
router.post("/driver-verifications/reject", driverVerificationAdminController.rejectVerification);

//get all states and cities
router.get('/states', getAllStates);
router.get('/cities/:state', getCitiesForState);

//Dashboard
router.get("/all-drivers",dashboardController.getAllDrivers);

// Admin cities management
router.post("/add-city", cityController.createCity);

router.get("/get-cities", cityController.getAllCities);
router.get("/get-cities-dashboard", cityController.getAllCitiesDashboard);

router.get("/get-city/:id", cityController.getCity);
router.put("/update-city/:id", cityController.updateCity);
router.delete("/delete-city/:id", cityController.deleteCity);
//Admin Fares managemant
router.post("/add-fares", faresController.createOrUpdateFare);

//admin feedback management
router.get("/get-all-feedback",feedbackController.getAllFeedback)
router.get("/get-feedback-filter/:feedbackType",feedbackController.getFilteredFeedbacks)
router.patch("/update-status/:id",feedbackController.updateFeedbackStatus)
router.delete("/delete-feedback/:id",feedbackController.deleteFeedback)


//admin custom notifiation
router.route("/custom-notify").post(customNotifyController.customNotify)
router.route("/all-custom-notify").get(customNotifyController.getAllCustomNotify); // Get subadmin by ID
router.delete("/delete-custom-notify/:id", customNotifyController.deleteCustomNotify);

// cab subscription
router.route("/cab-subscription/add").post(CabSubscriptionController.createCabSubscription);

// Route to manage cab subscription plans
router.route("/cab-subscription/:planId")
  .delete(CabSubscriptionController.deleteCabSubscription)
  .patch(CabSubscriptionController.updateCabSubscription)
  .get(CabSubscriptionController.getCabSubscriptionById);

// Route to get all cab subscription plans
router.route("/cab-subscriptions").get(CabSubscriptionController.getAllCabSubscriptions);

// Route to manage Auto subscription plans
router.route("/auto-subscription/:id")
  .delete(CabSubscriptionController.deleteAutoSubscription)    // DELETE request to remove an auto subscription by ID
  .patch(CabSubscriptionController.updateAutoSubscription)     // PATCH request to update an existing auto subscription
  // .get(CabSubscriptionController.getAutoSubscriptionById);     // GET request to fetch an auto subscription by its ID

// Route to get all auto subscription plans
router.route("/auto-subscriptions")
  .get(CabSubscriptionController.getAllAutoSubscriptions);     // GET request to fetch all auto subscriptions

// Route to add a new auto subscription
router.route("/auto-subscription/add")
  .post(CabSubscriptionController.addAutoSubscription); 

  //added vheicles newly
  router.route("/all-added-vehicles").get(addVehicleController.getAllAddedVehicles); // 
  router.route("/approve-vehicle").post(addVehicleController.approveVerification); // 
  router.route("/reject-vehicle").post(addVehicleController.rejectVerification); // 



export default router;


// this change is made by prajwala