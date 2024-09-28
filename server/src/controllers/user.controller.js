import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  requestOtpSchema,
  verifyOtpSchema,
} from "../validators/userValidator.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import twilio from "twilio";
import { z } from "zod";

const requestOtp = asyncHandler(async (req, res) => {
  const { countryCode, phone } = req.body;
  const { success } = requestOtpSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError("Please enter correct fields", 400);
  }
  const fullPhone = `${countryCode}${phone}`;
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new ApiError("User already exists", 409);
  }

  const user = new User({ countryCode, phone: fullPhone });
  const otp = await user.generateAndSendOTP(twilioClient, twilioPhoneNumber);
  await user.save();
  const createdUser = await User.findById(user._id);
  if (!createdUser)
    throw new ApiError("Something went wrong while sending OTP", 500);
  res.status(200).json(new ApiResponse(200, { otp }, "OTP sent"));
});

export { requestOtp };
