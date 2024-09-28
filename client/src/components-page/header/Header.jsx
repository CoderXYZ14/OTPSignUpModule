import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a button component in your UI library
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img
          src="https://as2.ftcdn.net/v2/jpg/01/33/48/03/1000_F_133480376_PWlsZ1Bdr2SVnTRpb8jCtY59CyEBdoUt.jpg" // Replace with your logo path
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <h1 className="text-2xl font-bold">Register</h1>
      </div>

      {location.pathname !== "/sign-in" && !isSignedUp && (
        <Button
          onClick={handleSignUp}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          Sign Up
        </Button>
      )}
    </div>
  );
};

export default Header;
