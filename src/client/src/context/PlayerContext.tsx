"use client";

import React, { createContext, useState, useContext } from "react";

interface PlayerState {
  currentSong: string | null; // ID hoặc URL của bài hát
  isPlaying: boolean;
  volume: number;
  play: (song: string) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const play = (song: string) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        play,
        pause,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// Hook để dễ dàng sử dụng context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
