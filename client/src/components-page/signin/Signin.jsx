import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodeData } from "../../utils/countrycode.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePhoneInfo } from "@/context/phoneContext.jsx";
import { Heading } from "../extra-comp/Heading.jsx";
import { SubHeading } from "../extra-comp/SubHeading.jsx";

const Signin = () => {
  const { setPhoneInfo } = usePhoneInfo();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!phone || !countryCode) {
      setErrorMessage("Phone number and country code are required");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/request-otp",
        {
          phone,
          countryCode,
        }
      );

      // Check for a successful response
      if (response.status === 200) {
        setPhoneInfo({ phone, countryCode });
        navigate("/verify-otp");
      }
    } catch (error) {
      setErrorMessage(
        "Invalid phone number or country code. Please try again."
      ); // Set error message
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center w-full max-w-md">
        <div className="rounded-lg bg-white shadow-lg p-6 mx-4">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your info"} />
          <div className="flex items-center space-x-2 mt-4">
            <Select onValueChange={(value) => setCountryCode(value)}>
              <SelectTrigger className="w-[120px] text-sm">
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
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="1234567890"
              label="phone"
              className="w-full text-sm"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p> // Display error message
          )}
          <div className="pt-4">
            <Button
              disabled={!phone || loading}
              onClick={requestOtp}
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
