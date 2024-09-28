import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { PhoneInfoContext } from "@/context/phoneContext";
import { Heading, SubHeading } from "../extra-comp";

const VerifyOTP = () => {
  const { phoneInfo } = useContext(PhoneInfoContext);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [phone, setPhone] = useState(phoneInfo?.phone || "");
  const [countryCode, setCountryCode] = useState(
    phoneInfo?.countryCode || "+91"
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const handleOtpChange = (value) => {
    setOtp(value);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const verifyOtp = async () => {
    if (!otp) {
      setErrorMessage("OTP is required");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/register",
        {
          phone: `${countryCode}${phone}`,
          otp,
        }
      );

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        console.log("Access token:", accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setSuccessMessage("Sign up successful!");
        alert("Sign up successful!");

        setTimeout(() => {
          navigate("/");
        }, 1000);

        console.log("OTP verified successfully");
      }
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
      alert("Invalid OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => setIsChecked(event.target.checked);

  return (
    <div className="bg-slate-300 min-h-screen flex items-center justify-center p-4">
      <div className="rounded-lg bg-white w-full max-w-md p-6 text-center shadow-md">
        <Heading label="Verify OTP" />
        <SubHeading label={`Enter the OTP sent to ${countryCode} ${phone}`} />

        <div className="mt-4 flex justify-center">
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
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}

        <div className="flex items-center justify-center space-x-2 mt-4">
          <input
            type="checkbox"
            id="otpCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="cursor-pointer"
          />
          <HoverCard>
            <HoverCardTrigger asChild>
              <label
                htmlFor="otpCheckbox"
                className="cursor-pointer text-sm text-gray-600"
              >
                Terms & Conditions
              </label>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              Please read and accept our terms and conditions before proceeding.
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            className="w-full max-w-xs"
            disabled={!otp || loading || !isChecked}
            onClick={verifyOtp}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
