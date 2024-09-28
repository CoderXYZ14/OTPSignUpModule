import React, { createContext, useContext, useState } from "react";

export const PhoneInfoContext = createContext(null);

export const PhoneInfoProvider = ({ children }) => {
  const [phoneInfo, setPhoneInfo] = useState({ phone: "", countryCode: "" });

  return (
    <PhoneInfoContext.Provider value={{ phoneInfo, setPhoneInfo }}>
      {children}
    </PhoneInfoContext.Provider>
  );
};

// Custom hook for easy access to the context
export const usePhoneInfo = () => useContext(PhoneInfoContext);
