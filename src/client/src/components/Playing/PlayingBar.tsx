"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useUI } from "@/context/UIContext";
import apiConfig from "@/lib/api";
import { IMAGES, paths } from "@/lib/constants";
import { apiImage, formatDuration } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Slider from "../Slider";
import { ButtonIcon } from "../ui/Button";
import ControlsPlaying from "./ControlsPlaying";
import styles from "./style.module.scss";

const PlayingBar = () => {
  return (
    <>
      <div className={`${styles.PlayingBar} `}>
        <div className={`${styles.PlayingBar_left}`}>
          <LeftPlayingBar />
        </div>
        <div className={`${styles.PlayingBar_center}`}>
          <CenterPlayingBar />
        </div>
        <div className={`${styles.PlayingBar_right}`}>
          <RightPlayingBar />
        </div>
      </div>
    </>
  );
};

const LeftPlayingBar = () => {
  const { currentSong } = usePlayer();

  return (
    <div className={`${styles.LeftPlayingBar}`}>
      <div className={`${styles.LeftPlayingBar_image}`}>
        <Image
          src={
            currentSong?.imagePath
              ? apiImage(currentSong.imagePath)
              : IMAGES.SONG
          }
          alt=""
          width={60}
          height={60}
          quality={100}
        />
      </div>
      <div className={`${styles.LeftPlayingBar_desc}`}>
        <h4>{currentSong?.title}</h4>
        <Link href={`${paths.ARTIST}/${currentSong?.creator?.slug}`}>
          {currentSong?.creator?.name}
        </Link>
      </div>
    </div>
  );
};

const CenterPlayingBar = () => {
  const [percentage, setPercentage] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const {
    currentSong,
    isPlaying,
    handleSongEnd,
    queue,
    volume,
    onChangeCurrentTime,
  } = usePlayer();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    setPercentage(parseFloat(e.target.value));
  };

  const onPlaying = () => {
    const audio = audioRef.current;
    // Lấy thời gian hiên tại của bài hát
    if (audio && audio.currentTime) {
      onChangeCurrentTime(audio.currentTime);
      const percent = ((audio?.currentTime / audio?.duration) * 100).toFixed(2);
      setPercentage(+percent);
    }
  };

  const handlePlayAgain = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Đặt thời gian về 0
      audioRef.current.play(); // Phát lại từ đầu
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = apiConfig.audioURL("");
      audioRef.current.pause();

      audioRef.current.src = apiConfig.audioURL(currentSong?.songPath || "");
      audioRef.current.play();
    }
  }, [currentSong]);


  return (
    <div className={`${styles.CenterPlayingBar}`}>
      <div className={`${styles.CenterPlayingBar_top}`}>
        <ControlsPlaying />
      </div>
      <div className={`${styles.CenterPlayingBar_bottom}`}>
        <span>
          {audioRef.current
            ? formatDuration(audioRef.current?.currentTime)
            : "00:00"}
        </span>
        <Slider percentage={percentage} onChange={onChange} />
        <span>
          {audioRef.current
            ? formatDuration(audioRef.current?.duration)
            : "00:00"}
        </span>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={onPlaying}
        onEnded={queue.length > 0 ? handleSongEnd : handlePlayAgain}
        src={
          currentSong && currentSong.songPath
            ? apiConfig.audioURL(currentSong.songPath)
            : ""
        }
      ></audio>
    </div>
  );
};

const RightPlayingBar = () => {
  const { toggleWaiting, toggleLyrics } = useUI();
  const [percentage, setPercentage] = React.useState(50);
  const { setVolume, volume, queue } = usePlayer();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(parseFloat(e.target.value));
    setVolume(parseFloat(e.target.value));
  };

  return (
    <>
      <div className={`${styles.RightPlayingBar}`}>
        <ButtonIcon
          onClick={() => toggleLyrics()}
          icon={<i className="fa-light fa-microphone-stand"></i>}
        />
        <div className={`${styles.RightPlayingBar_volume}`}>
          {volume ? (
            <ButtonIcon
              onClick={() => setVolume(0)}
              icon={<i className="fa-light fa-volume"></i>}
            />
          ) : (
            <ButtonIcon
              onClick={() => {
                if (percentage === 0) {
                  setVolume(50);
                  setPercentage(50);
                } else {
                  setVolume(percentage);
                }
              }}
              icon={<i className="fa-light fa-volume-mute"></i>}
            />
          )}
          <div className={`${styles.RightPlayingBar_volume_slide}`}>
            <Slider percentage={percentage} onChange={onChange} />
          </div>
        </div>
        {queue.length > 0 && (
          <ButtonIcon
            onClick={toggleWaiting}
            icon={<i className="fa-duotone fa-list"></i>}
          />
        )}
      </div>
    </>
  );
};

export default PlayingBar;
