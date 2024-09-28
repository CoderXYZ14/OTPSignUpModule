import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  requestOtpSchema,
  verifyOtpSchema,
} from "../validators/userValidator.js";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(500, "Error generating access and refresh token");
  }
};

const requestOtp = asyncHandler(async (req, res) => {
  const { countryCode, phone } = req.body;
  const { success } = requestOtpSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError("Please enter correct fields", 400);
  }
  const fullPhone = `${countryCode}${phone}`;
  const existingUser = await User.findOne({ phone: fullPhone });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = new User({ phone: fullPhone });
  const otp = await user.generateAndSendOTP(twilioClient, twilioPhoneNumber);
  await user.save();
  const createdUser = await User.findById(user._id);
  if (!createdUser)
    throw new ApiError("Something went wrong while sending OTP", 500);
  res.status(200).json(new ApiResponse(200, { otp }, "OTP sent"));
});

//verify otp and register
const register = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const { success } = verifyOtpSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, "Please enter correct fields");

  const user = await User.findOne({ phone });
  if (!user) throw new ApiError(409, "No user existed");

  const verifyOtpSuccess = await user.verifyOTP(otp);
  if (!verifyOtpSuccess) throw new ApiError(401, "Invalid OTP");

  await user.save();

  let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

export { requestOtp, register };
