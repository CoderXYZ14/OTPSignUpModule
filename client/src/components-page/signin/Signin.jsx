import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";

import { Heading } from "./Heading";
import { SubHeading } from "./SubHeading";
import { useState } from "react";

const Signin = () => {
  const [phone, setPhone] = useState("");
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your info"} />
          <div className="mt-2">
            <PhoneInput
              country={"us"} // Default country code
              value={phone}
              onChange={setPhone}
              inputStyle={{ width: "100%" }} // Styling for the input field
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
