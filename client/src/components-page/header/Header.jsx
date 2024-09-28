import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if accessToken is present in local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsSignedUp(!!token); // Set isSignedUp to true if token exists
  }, []);

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8080/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsSignedUp(false);

      // Redirect to the sign-in page
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Update isSignedUp state when token is added to local storage
  useEffect(() => {
    const checkTokenOnSignUp = () => {
      const token = localStorage.getItem("accessToken");
      setIsSignedUp(!!token);
    };

    window.addEventListener("storage", checkTokenOnSignUp);
    return () => {
      window.removeEventListener("storage", checkTokenOnSignUp);
    };
  }, []);

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img
          src="https://as2.ftcdn.net/v2/jpg/01/33/48/03/1000_F_133480376_PWlsZ1Bdr2SVnTRpb8jCtY59CyEBdoUt.jpg"
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <h1 className="text-2xl font-bold">Register</h1>
      </div>

      {location.pathname !== "/sign-in" && (
        <div>
          <Button
            onClick={handleSignUp}
            className={`bg-gray-800 hover:bg-gray-700 text-white ${
              isSignedUp ? "hidden" : ""
            }`}
          >
            Sign Up
          </Button>
          <Button
            onClick={handleSignOut}
            className={`bg-red-600 hover:bg-red-500 text-white ${
              !isSignedUp ? "hidden" : ""
            }`}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
