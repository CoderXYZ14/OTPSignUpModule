import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Signin, VerifyOTP } from "./components-page/index.js";
import { PhoneInfoProvider } from "./context/phoneContext.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/sign-in", element: <Signin /> },
      {
        path: "/",
        element: <Home />,
      },
      { path: "/verify-otp", element: <VerifyOTP /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PhoneInfoProvider>
      <RouterProvider router={router} />
    </PhoneInfoProvider>
  </StrictMode>
);
