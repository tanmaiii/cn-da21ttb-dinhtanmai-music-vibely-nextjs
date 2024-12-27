"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IArtist } from "@/types";
// export interface userState {
//   id: string;
//   name: string;
//   email: string;
//   role: {
//     id: string;
//     name: string;
//   };
//   imagePath: string;
// }


export const userSlide = createSlice({
  name: "user",
  initialState: null as IArtist | null,
  reducers: {
    setUser: (state, action: PayloadAction<IArtist | null>) => {
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
