import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  phone: null, // Storing the full phone number
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.phone = null; // Reset phone on logout
    },
    setPhone: (state, action) => {
      state.phone = action.payload; // New action to set the full phone number
    },
  },
});

export const { login, logout, setPhone } = authSlice.actions;

export default authSlice.reducer;
