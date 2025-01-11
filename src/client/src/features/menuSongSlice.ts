"use client";
import { ISong } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface menuSongState {
  open: boolean;
  song?: ISong;
  // playlistId?: string;
  // left: number;
  // top: number;
  // width?: number;
  // height?: number;
}

const initialState: menuSongState = {
  open: false,
  song: undefined,
  // playlistId?: "";
  // left: 0,
  // top: 0,
  // width: 0,
  // height: 0,
};

export const menuSong = createSlice({
  name: "user",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuSongState>) => {
      state.open = true;
      state.song = action.payload.song;
      // state.playlistId = action.payload.playlistId;
      // state.left = action.payload.left;
      // state.width = action.payload.width;
      // state.top = action.payload.top;
      // state.height = action.payload.height;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

export const { openMenu, closeMenu } = menuSong.actions;

export default menuSong.reducer;
