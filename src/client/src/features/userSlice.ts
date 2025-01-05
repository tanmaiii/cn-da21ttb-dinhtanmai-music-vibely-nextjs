"use client";
import { IUser } from "@/types/user.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const userSlide = createSlice({
  name: "user",
  initialState: null as IUser | null,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state = action.payload;
      return state;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlide.actions;

export default userSlide.reducer;
