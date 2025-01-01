import React from "react";
import styles from './style.module.scss'

const IconPlay = ({playing = false}:{playing?: boolean}) => {
  return (
    <div>
      <div className={`${styles.music_waves} ${playing ? styles.music_waves_playing : ''}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default IconPlay;
