import React from "react";
import { ButtonIcon, ButtonIconPrimary } from "../ui/Button";

export const ControlPlayPause = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
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
      onClick={() => setIsPlaying(!isPlaying)}
    />
  );
};

const ControlsPlaying = () => {
  return (
    <>
      <ButtonIcon icon={<i className="fa-light fa-shuffle"></i>} />
      <ButtonIcon icon={<i className="fa-solid fa-backward-step"></i>} />
      <ControlPlayPause />
      <ButtonIcon icon={<i className="fa-solid fa-forward-step"></i>} />
      <ButtonIcon icon={<i className="fa-light fa-repeat"></i>} />
    </>
  );
};

export default ControlsPlaying;
