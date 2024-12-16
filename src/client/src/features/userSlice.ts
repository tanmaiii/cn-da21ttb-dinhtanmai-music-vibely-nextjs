"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export const initialState: userState = {
  id: "",
  name: "",
  email: "",
  role: "",
  avatar: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
    },
    clearUser: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.avatar = "";
    },
  },
});


export const { setUser, clearUser } = userSlide.actions;

export default userSlide.reducer;