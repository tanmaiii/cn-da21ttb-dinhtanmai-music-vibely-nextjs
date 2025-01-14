"use client";

import songService from "@/services/song.service";
import { ISong } from "@/types";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

type PlayMode = "normal" | "random";

interface PlayerState {
  currentSong: ISong | null; // Bài hát hiện tại
  isPlaying: boolean;
  volume: number;
  queue: ISong[]; // Danh sách bài hát chờ
  playMode: PlayMode;
  currentTime: number;
  play: (song?: ISong) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: ISong) => void;
  removeFromQueue: (song: ISong) => void;
  togglePlayMode: () => void;
  playPlaylist: (playlist: ISong[]) => void; // Hàm phát playlist
  playNext: () => void;
  playPrevious: () => void;
  handleSongEnd: () => void;
  onChangeCurrentTime: (time: number) => void;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<ISong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [queue, setQueue] = useState<ISong[]>([]);
  const [playMode, setPlayMode] = useState<PlayMode>("normal");
  const [currentIndex, setCurrentIndex] = useState(0);

  const play = async (song?: ISong) => {
    if (!song) {
      setIsPlaying(true);
      return;
    }
    try {
      setCurrentSong(song);
      const res = await songService.playSong(song.id);
      if (res) {
        setIsPlaying(true);
      }
    } catch (error: unknown) {
      console.error((error as Error).message);
      toast.error("Audio not found");
      setIsPlaying(false);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const addToQueue = (song: ISong) => {
    toast.success("Added to queue");
    setQueue((prev) => [...prev, song]); // Thêm bài hát vào cuối queue
    if (queue.length === 0) {
      setQueue([song]);
      setCurrentSong(song);
      setIsPlaying(true);
      return;
    }
  };

  const removeFromQueue = (song: ISong) => {
    const newQueue = queue.filter((item) => item.id !== song.id);
    // if(newQueue.length === 0) {
    //   stop();
    // }
    if(queue.length === 1) {
     stop();
    }
    if(currentSong?.id === song.id){
      playNext();
      setQueue(newQueue);
    }else{
      setQueue(newQueue);
    }
  };

  // Phát bài tiếp theo
  const playNext = () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;
    }

    if (playMode === "random") {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === currentIndex);
      const nextSong = queue[randomIndex];
      setCurrentSong(nextSong);
      setCurrentIndex(randomIndex);
    } else {
      const nextIndex = (currentIndex + 1) % queue.length;
      const nextSong = queue[nextIndex];
      setCurrentSong(nextSong);
      setCurrentIndex(nextIndex);
    }

    setIsPlaying(true);
  };

  // Phát bài trước
  const playPrevious = () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;
    }

    if (playMode === "random") {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === currentIndex);
      const prevSong = queue[randomIndex];
      setCurrentSong(prevSong);
      setCurrentIndex(randomIndex);
    } else {
      // Quay ngược lại bài trước
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      const prevSong = queue[prevIndex];
      setCurrentSong(prevSong);
      setCurrentIndex(prevIndex);
    }

    setIsPlaying(true);
  };

  // Xử lý khi bài hát kết thúc
  const handleSongEnd = () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;

      // setCurrentSong(null);
      // setIsPlaying(false);

      // setCurrentSong(currentSong);
      // setIsPlaying(true);
      // return;
    }

    if (playMode === "random") {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === currentIndex);
      const nextSong = queue[randomIndex];
      setCurrentSong(nextSong);
      setCurrentIndex(randomIndex);
    } else {
      // Phát bài tiếp theo
      const nextIndex = (currentIndex + 1) % queue.length;
      const nextSong = queue[nextIndex];
      setCurrentSong(nextSong);
      setCurrentIndex(nextIndex);
    }

    setIsPlaying(true);
  };

  const playPlaylist = (playlist: ISong[]) => {
    if (playlist.length === 0) return;

    setQueue(playlist);
    setCurrentSong(playlist[0]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const togglePlayMode = () => {
    setPlayMode((prev) => (prev === "normal" ? "random" : "normal")); // Chuyển đổi giữa normal và shuffle
  };

  const stop = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setQueue([]);
    pause();
  };

  const onChangeCurrentTime = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        queue,
        playMode,
        currentTime,
        play,
        pause,
        stop,
        setVolume,
        addToQueue,
        removeFromQueue,
        togglePlayMode,
        playNext,
        playPrevious,
        playPlaylist,
        handleSongEnd,
        onChangeCurrentTime,
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
