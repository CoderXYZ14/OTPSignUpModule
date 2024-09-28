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
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!phone || !countryCode) {
      // Add some validation logic (e.g., alert or message)
      console.error("Phone number and country code are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/request-otp",
        {
          phone,
          countryCode,
        }
      );

      // Check for a successful response here
      if (response.status === 200) {
        setPhoneInfo({ phone, countryCode });
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error(error);
      // Optionally display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-[500px] text-center p-2 h-max px-4">
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
            <div className="pt-4">
              <div className="flex justify-end gap-5">
                <Button disabled={!phone || loading} onClick={requestOtp}>
                  {loading ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
