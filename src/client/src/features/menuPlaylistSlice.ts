"use client";
import { IPlaylist } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface menuState {
  open: boolean;
  playlist?: IPlaylist;
  position?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

const initialState: menuState = {
  open: false,
  playlist: undefined,
};

export const menuPlaylist = createSlice({
  name: "user",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuState>) => {
      state.open = true;
      state.playlist = action.payload.playlist;
      state.position = action.payload.position;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

export const { openMenu, closeMenu } = menuPlaylist.actions;

export default menuPlaylist.reducer;
