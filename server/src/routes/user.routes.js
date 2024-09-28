import { Router } from "express";
import {
  logoutUser,
  register,
  requestOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/request-otp").post(requestOtp);
router.route("/register").post(register);
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
