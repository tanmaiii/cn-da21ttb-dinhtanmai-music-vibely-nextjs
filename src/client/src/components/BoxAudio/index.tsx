import { formatDuration } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { ControlPlayPause } from "../Playing/ControlsPlaying";
import Slider from "../Slider";
import { ButtonIcon } from "../ui";
import styles from "./style.module.scss";

interface Props {
  file: File | null;
  onChangeDuration: (duration: number) => void;
}

const BoxAudio = ({ file: fileMp3, onChangeDuration }: Props) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [urlMp3, setUrlMp3] = useState<string | null>(() =>
    fileMp3 ? URL.createObjectURL(fileMp3) : null
  );
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [percentage, setPercentage] = React.useState(0);
  const [volume, setVolume] = React.useState<number>(50);
  const [percentageVolume, setPercentageVolume] = React.useState(50);

  useEffect(() => {
    if (fileMp3) {
      setUrlMp3(URL.createObjectURL(fileMp3));
      audioRef.current?.load();
      setIsPlaying(false);
      setPercentage(0);
    }
  }, [fileMp3]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    setPercentage(parseFloat(e.target.value));
  };

  const onPlaying = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime) {
      const percent = ((audio?.currentTime / audio?.duration) * 100).toFixed(2);
      setPercentage(+percent);
    }
  };

  const onEndedAuido = () => {
    setIsPlaying(false);
    setPercentage(0);
  };

  const handlePlay = () => {
    if (audioRef.current?.paused) {
      setIsPlaying(true);
      audioRef.current?.play();
    } else {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  };

  const onChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageVolume(parseFloat(e.target.value));
    setVolume(parseFloat(e.target.value));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className={styles.BoxAudio}>
      <audio
        ref={audioRef}
        id="audio"
        onLoadedData={() => onChangeDuration(audioRef.current?.duration || 0)}
        src={urlMp3 ? urlMp3 : ""}
        onTimeUpdate={onPlaying}
        onEnded={onEndedAuido}
      ></audio>
      <div className={styles.BoxAudio_button}>
        <ControlPlayPause isPlaying={isPlaying} onChange={() => handlePlay()} />
      </div>
      <div className={styles.BoxAudio_body}>
        <Slider percentage={percentage} onChange={onChange} />
        <div className={styles.time}>
          <span>{`${
            audioRef.current?.currentTime
              ? formatDuration(audioRef.current?.currentTime)
              : "00:00"
          }`}</span>
          <span>{`${
            audioRef.current?.duration
              ? formatDuration(audioRef.current?.duration)
              : "00:00"
          }`}</span>
        </div>
      </div>
      <div className={styles.BoxAudio_volume}>
        {volume ? (
          <ButtonIcon
            onClick={() => setVolume(0)}
            icon={<i className="fa-light fa-volume"></i>}
          />
        ) : (
          <ButtonIcon
            onClick={() => {
              if (percentageVolume === 0) {
                setVolume(50);
                setPercentageVolume(50);
              } else {
                setVolume(percentageVolume);
              }
            }}
            icon={<i className="fa-light fa-volume-mute"></i>}
          />
        )}
        <div className={`${styles.RightPlayingBar_volume_slide}`}>
          <Slider percentage={percentageVolume} onChange={onChangeVolume} />
        </div>
      </div>
    </div>
  );
};

export default BoxAudio;
