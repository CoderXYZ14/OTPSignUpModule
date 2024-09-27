import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import twilio from "twilio";

const userSchema = new Schema(
  {
    countryCode: {
      type: String,
      required: true,
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
    phone: {
      type: String,
      required: true,
      unique: true,
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
