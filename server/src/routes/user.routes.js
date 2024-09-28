import { Router } from "express";
import { register, requestOtp } from "../controllers/user.controller.js";

const router = Router();
router.route("/request-otp").post(requestOtp);
router.route("/register").post(register);
export default router;
