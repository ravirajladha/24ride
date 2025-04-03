import { Router } from "express";
import { sendOtp,customerRegistrer,verifyOtpAndLogin } from "../controllers/customer/customerAuth.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import deleteAccountController from "../controllers/customer/deleteAccount.controller.js";
import updateCustomerLocationController from "../controllers/customer/updateCustomerLocation.controller.js";

const router = Router();

// Customer send-otp
router.post("/register",customerRegistrer)

router.post("/send-otp", sendOtp);
router.post("/verify-otp-login",verifyOtpAndLogin,)


// Protect customer routes
router.use(verifyJWT, verifyRole("customer"));

router.put("/update-customer-location",(req,res,next)=>{
  console.log('Update location request received');
next()
},updateCustomerLocationController.updateLocation)

router.delete("/delete-account/:id",deleteAccountController.deleteAccount)





router.get("/profile", (req, res) => {
  return res.json({ message: "Customer profile data", user: req.user });
});

export default router;
