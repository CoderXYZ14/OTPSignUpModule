import { z } from "zod";

// Schema for requesting OTP
export const requestOtpSchema = z.object({
  countryCode: z
    .string()
    .min(1, "Country code is required")
    .regex(
      /^\+\d{1,3}$/,
      "Country code must start with '+' and be followed by 1-3 digits"
    ),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be at most 15 digits long")
    .regex(/^\d{7,14}$/, "Phone number must contain only digits"),
});

// Schema for verifying OTP
export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .length(13, "Phone number must be exactly 13 characters long")
    .regex(/^\+91\d{10}$/, "Phone number must be in the format +91XXXXXXXXXX"),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits long")
    .regex(/^\d{4}$/, "OTP must contain only four digits"),
});
