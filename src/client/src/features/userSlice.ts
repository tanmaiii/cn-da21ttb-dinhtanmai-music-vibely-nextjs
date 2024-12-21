"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  imagePath: string;
}

// export const initialState: userState = {
//   id: "",
//   name: "",
//   email: "",
//   role: "",
//   imagePath: "",
// };

export const userSlide = createSlice({
  name: "user",
  initialState: null as userState | null,
  reducers: {
    setUser: (state, action: PayloadAction<userState | null>) => {
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
