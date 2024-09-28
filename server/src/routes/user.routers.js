import { Router } from "express";
import { requestOtp } from "../controllers/user.controller";

const router = Router();
router.route("/register").post(requestOtp);
export default router;
