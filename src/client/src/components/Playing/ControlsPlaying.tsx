import { usePlayer } from "@/context/PlayerContext";
import { ButtonIcon, ButtonIconPrimary } from "../ui/Button";
import styles from "./style.module.scss";

export const ControlPlayPause = ({
  isPlaying,
  onChange,
  size = "large",
}: {
  isPlaying: boolean;
  onChange: () => void;
  size?: "large" | "medium";
}) => {
  return (
    <ButtonIconPrimary
      size={size}
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

const ControlsPlaying = () => {
  const {
    isPlaying,
    playMode,
    togglePlayMode,
    queue,
    playNext,
    playPrevious,
    pause,
    play,
  } = usePlayer();

  const handleOnPlay = () => (isPlaying ? pause() : play());

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
        onClick={() => playPrevious()}
      />
      <ControlPlayPause isPlaying={isPlaying} onChange={() => handleOnPlay()} />
      <ButtonIcon
        hide={queue.length === 0}
        icon={<i className="fa-solid fa-forward-step"></i>}
        onClick={() => playNext()}
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
