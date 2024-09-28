import React, { useState, useContext, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { PhoneInfoContext } from "@/context/phoneContext";
import { Heading, SubHeading } from "../extra-comp";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const { phoneInfo } = useContext(PhoneInfoContext); // Access phoneInfo from context
  const [otp, setOtp] = useState(""); // State to store the OTP
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  // Check if phoneInfo exists, if not redirect to /sign-in
  useEffect(() => {
    if (!phoneInfo || !phoneInfo.phone) {
      navigate("/sign-in");
    }
  }, [phoneInfo, navigate]);

  // Extract phone and countryCode from phoneInfo
  const [phone, setPhone] = useState(phoneInfo?.phone || "");
  const [countryCode, setCountryCode] = useState(
    phoneInfo?.countryCode || "+1"
  ); // Default country code if not present

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOtp = async () => {
    if (!otp) {
      console.error("OTP is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/register",
        {
          phone: `${countryCode}${phone}`, // Include country code with phone
          otp,
        }
      );

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data.data;

        // Store accessToken, refreshToken, and user info in localStorage
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
        // localStorage.setItem("user", JSON.stringify(user));

        navigate("/"); // Navigate to the home page after successful verification
        console.log("OTP verified successfully");
      }
    } catch (error) {
      console.error(error);
      // Display an error message if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-[500px] text-center p-2 h-max px-4">
          <Heading label={"Verify OTP"} />
          <SubHeading
            label={`Enter the OTP sent to ${countryCode} ${phone}`}
          />{" "}
          {/* Display country code with phone number */}
          <InputOTP maxLength={6} onChange={handleOtpChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex items-center space-x-2 mt-4">
            <div className="pt-4">
              <div className="flex justify-end gap-5">
                <Button disabled={!otp || loading} onClick={verifyOtp}>
                  {loading ? <Loader2 className="animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
