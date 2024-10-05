import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Terminal } from "lucide-react";

import { countryCodeData } from "../../utils/countrycode.js";
import { useDispatch } from "react-redux";
import { setPhone } from "../../store/authSlice.js"; // Import the setPhone action
import { Heading } from "../extra-comp/Heading.jsx";
import { SubHeading } from "../extra-comp/SubHeading.jsx";

const Signup = () => {
  const [phone, setPhoneState] = useState(""); // Renamed to avoid confusion
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();

    // Check if phone or country code is missing
    if (!phone || !countryCode) {
      setAlert({
        show: true,
        message: "Error creating account or logging in. Please try again.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Concatenate country code and phone
      const fullPhoneNumber = `${countryCode}${phone}`;

      const response = await axios.post(
        "http://localhost:8080/api/v1/users/request-otp",
        {
          phone, // Send the full phone number
          countryCode, // You can still send countryCode if needed
        }
      );

      if (response.status === 200) {
        dispatch(setPhone(fullPhoneNumber)); // Dispatch the full phone number to Redux
        setAlert({
          show: true,
          message: "Account created and logged in successfully!",
          type: "success",
        });
        navigate("/verify-otp");
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "Error creating account or logging in. Please try again.",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center w-full h-screen">
      <div className="w-full max-w-md bg-white h-auto px-6 py-8 rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
        {alert.show && (
          <Alert
            className={alert.type === "error" ? "bg-red-400" : "bg-green-400"}
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>
              {alert.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <Heading label={"Sign In"} />
        <SubHeading label={"Enter your info"} />

        <form onSubmit={requestOtp}>
          <div className="flex items-center space-x-2 mt-4">
            <Select onValueChange={(value) => setCountryCode(value)}>
              <SelectTrigger className="w-[120px] text-sm ">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {countryCodeData.map((country) => (
                  <SelectItem key={country.code} value={country.dial_code}>
                    {`${country.emoji} ${country.name} (${country.dial_code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              onChange={(e) => setPhoneState(e.target.value)} // Renamed to avoid confusion
              placeholder="1234567890"
              label="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!phone || loading}
              className="rounded-lg bg-orange-600 w-full text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create an account <LogIn className="ml-2" />
                </>
              )}
            </Button>

            <p className="text-sm mt-3 font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-orange-600 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
