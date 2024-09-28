import { Router } from "express";
import { requestOtp } from "../controllers/user.controller";

const router = Router();
router.route("/request-otp").post(requestOtp);
export default router;
