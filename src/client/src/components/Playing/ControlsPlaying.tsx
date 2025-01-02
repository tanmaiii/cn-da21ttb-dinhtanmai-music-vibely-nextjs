import React from "react";
import { ButtonIcon, ButtonIconPrimary } from "../ui/Button";
import { usePlayer } from "@/context/PlayerContext";
import styles from "./style.module.scss";

export const ControlPlayPause = ({
  isPlaying,
  onChange,
}: {
  isPlaying: boolean;
  onChange: () => void;
}) => {
  return (
    <ButtonIconPrimary
      size="large"
      icon={
        isPlaying ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )
      }
      onClick={() => onChange()}
    />
  );
};

interface Props {
  onPlay: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const ControlsPlaying = ({ onPlay, onPrev, onNext }: Props) => {
  const { isPlaying, playMode, togglePlayMode, queue } = usePlayer();

  return (
    <>
      <ButtonIcon
        hide={queue.length === 0}
        className={
          playMode === "random" ? styles.ControlsPlaying_btn_random : ""
        }
        icon={<i className="fa-light fa-shuffle"></i>}
        onClick={() => togglePlayMode()}
      />
      <ButtonIcon
        hide={queue.length === 0}
        icon={<i className="fa-solid fa-backward-step"></i>}
        onClick={onPrev}
      />
      <ControlPlayPause isPlaying={isPlaying} onChange={() => onPlay()} />
      <ButtonIcon
        hide={queue.length === 0}
        icon={<i className="fa-solid fa-forward-step"></i>}
        onClick={onNext}
      />
      <ButtonIcon
        hide={queue.length === 0}
        className={
          playMode === "normal" ? styles.ControlsPlaying_btn_repeat : ""
        }
        onClick={() => togglePlayMode()}
        icon={<i className="fa-light fa-repeat"></i>}
      />
    </>
  );
};

export default ControlsPlaying;
