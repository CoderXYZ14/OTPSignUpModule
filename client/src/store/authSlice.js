import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  phone: null,
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
      state.phone = null;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
  },
});

export const { login, logout, setPhone } = authSlice.actions;

export default authSlice.reducer;
