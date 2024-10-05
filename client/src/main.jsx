import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Signup, VerifyOTP } from "./components-page/index.js";
//import { PhoneInfoProvider } from "./context/phoneContext.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/sign-up", element: <Signup /> },
      { path: "/verify-otp", element: <VerifyOTP /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
