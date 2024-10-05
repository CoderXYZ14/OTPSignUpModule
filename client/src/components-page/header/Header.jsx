import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Access the authentication status from the Redux store
  const isSignedUp = useSelector((state) => state.auth.status);

  // Check if accessToken is present in local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !isSignedUp) {
      // If there's a token but the Redux status is false, you may want to log in
      // This can be handled depending on your use case (e.g., auto-login or a different approach)
    }
  }, [isSignedUp]);

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) return;

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

      // Dispatch logout action to clear auth state
      dispatch(logout());

      // Redirect to the sign-in page
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
