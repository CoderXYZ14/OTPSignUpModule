import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { Loader2, LogIn } from "lucide-react";
import { login } from "../../store/authSlice";
import { Heading, SubHeading } from "../extra-comp";

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const phone = useSelector((state) => state.auth.phone);

  const [formData, setFormData] = useState({
    otp: "",
    termsAccepted: false,
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const isCheckbox = e.target.type === "checkbox";
    setFormData({
      ...formData,
      [e.target.name]: isCheckbox ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { otp, termsAccepted } = formData;

    if (!termsAccepted) {
      setAlert({
        show: true,
        message: "You must accept the terms and conditions.",
        type: "error",
      });
      return;
    }

    if (!otp) {
      setAlert({
        show: true,
        message: "OTP is required.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setAlert({ show: false, message: "", type: "" });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/register",
        {
          phone,
          otp,
        }
      );

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data.data; // Assuming userData is part of the response
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setAlert({
          show: true,
          message: "Sign up successful!",
          type: "success",
        });
        dispatch(login({ userData: user }));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "Invalid OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center w-full h-screen">
      <div className="w-full max-w-md bg-white h-auto px-6 py-8 rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        {alert.show && (
          <div
            className={`${
              alert.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white p-2 rounded mb-4`}
          >
            {alert.message}
          </div>
        )}

        <Heading label="Verify OTP" />
        <SubHeading label={`Enter the OTP sent to ${phone}`} />

        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex justify-center">
            <InputOTP
              maxLength={6}
              onChange={(value) =>
                handleChange({ target: { name: "otp", value } })
              }
            >
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

          <div className="flex items-center justify-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <label
              htmlFor="termsAccepted"
              className="ml-3 text-sm font-light text-gray-500 dark:text-gray-300"
            >
              I accept the{" "}
              <HoverCard>
                <HoverCardTrigger>
                  <span className="font-bold text-primary-600 hover:underline text-orange-600 cursor-pointer">
                    Terms and Conditions
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-lg">
                  Here are the terms and conditions you should accept before
                  signing up.
                </HoverCardContent>
              </HoverCard>
            </label>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="rounded-lg bg-orange-600 w-full text-sm"
              disabled={loading || !formData.otp || !formData.termsAccepted}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Verify <LogIn className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
