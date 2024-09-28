import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    countryCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAndSendOTP = async function (
  twilioClient,
  twilioPhoneNumber
) {
  const otpCode = crypto.randomInt(1000, 9999).toString();
  const otp = await bcrypt.hash(otpCode, 12);
  this.otp = otp;
  this.otpExpires = Date.now() + 15 * 60 * 1000;

  await twilioClient.messages.create({
    body: `Your verification code is ${otpCode}. It is valid for 15 minutes.`,
    from: twilioPhoneNumber,
    to: this.phone,
  });

  return otpCode;
};

userSchema.methods.verifyOTP = async function (inputOtp) {
  const isOtpValid = await bcrypt.compare(inputOtp, this.otpHash);
  const isExpired = this.otpExpires < Date.now();

  if (isOtpValid && !isExpired) {
    this.isVerified = true;
    this.otpHash = undefined;
    this.otpExpires = undefined;
  }
  return isOtpValid && !isExpired;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
