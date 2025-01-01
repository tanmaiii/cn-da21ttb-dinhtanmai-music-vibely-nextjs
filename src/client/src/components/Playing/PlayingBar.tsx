"use client";

import { useUI } from "@/context/UIContext";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ButtonIcon, ButtonIconSquare } from "../ui/Button";
import Slider from "../Slider";
import ControlsPlaying from "./ControlsPlaying";
import styles from "./style.module.scss";
import { usePlayer } from "@/context/PlayerContext";

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
  return (
    <div className={`${styles.LeftPlayingBar}`}>
      <div className={`${styles.LeftPlayingBar_image}`}>
        <Image
          src={"https://picsum.photos/id/233/60/60"}
          alt=""
          width={60}
          height={60}
          quality={100}
        />
      </div>
      <div className={`${styles.LeftPlayingBar_desc}`}>
        <h4>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          aperiam nesciunt autem recusandae repudiandae alias cupiditate,
          incidunt delectus animi
        </h4>
        <Link href="/song/123">Artist Name</Link>
      </div>
    </div>
  );
};

const CenterPlayingBar = () => {
  const [percentage, setPercentage] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { currentSong } = usePlayer();
  // const [isPlaying, setIsPlaying] = React.useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    setPercentage(parseFloat(e.target.value));
  };

  // const handleClick = () => {
  //   if (audioRef.current?.paused) {
  //     audioRef.current?.play();
  //     setIsPlaying(true);
  //   } else {
  //     setIsPlaying(false);
  //     audioRef.current?.pause();
  //   }
  // };

  const onPlaying = () => {
    const audio = audioRef.current;
    // Lấy thời gian hiên tại của bài hát
    if (audio && audio.currentTime) {
      const percent = ((audio?.currentTime / audio?.duration) * 100).toFixed(2);
      setPercentage(+percent);
    }
  };

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
        src={currentSong || ""}
      ></audio>
    </div>
  );
};

const RightPlayingBar = () => {
  const { toggleWaiting, toggleLyrics } = useUI();
  const [percentage, setPercentage] = React.useState(50);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(parseFloat(e.target.value));
  };

  return (
    <>
      <div className={`${styles.RightPlayingBar}`}>
        <ButtonIcon
          onClick={() => toggleLyrics()}
          icon={<i className="fa-light fa-microphone-stand"></i>}
        />
        <div className={`${styles.RightPlayingBar_volume}`}>
          <ButtonIcon icon={<i className="fa-light fa-volume"></i>} />
          <div className={`${styles.RightPlayingBar_volume_slide}`}>
            <Slider percentage={percentage} onChange={onChange} />
          </div>
        </div>
        <ButtonIconSquare
          onClick={toggleWaiting}
          icon={<i className="fa-duotone fa-list"></i>}
        />
      </div>
    </>
  );
};

export default PlayingBar;
