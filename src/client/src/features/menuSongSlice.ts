"use client";
import { IPlaylist, ISong } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface menuSongState {
  open: boolean;
  song?: ISong;
  playlist?: IPlaylist;
  position?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

const initialState: menuSongState = {
  open: false,
  song: undefined,
};

export const menuSong = createSlice({
  name: "user",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuSongState>) => {
      state.open = true;
      state.song = action.payload.song;
      state.playlist = action.payload.playlist;
      state.position = action.payload.position;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

export const { openMenu, closeMenu } = menuSong.actions;

export default menuSong.reducer;
