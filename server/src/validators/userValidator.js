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
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be at most 15 digits long")
    .regex(/^\d{7,14}$/, "Phone number must contain only digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits long")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});
