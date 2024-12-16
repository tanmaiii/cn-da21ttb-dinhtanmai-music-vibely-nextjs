"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

interface Props {
  percentage: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider = ({ percentage, onChange }: Props) => {
  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const rangeRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const rangeWidth = rangeRef.current?.getBoundingClientRect().width ?? 0;
    const thumbWidth = thumbRef.current?.getBoundingClientRect().width ?? 0;
    const centerThumb = (thumbWidth / 100) * percentage * -1;

    // let centerProgressBar =
    //   thumbWidth +
    //   (rangeWidth / 100) * percentage -
    //   (thumbWidth / 100) * percentage;

    // if (percentage === 0) {
    //   centerProgressBar = 0;
    // }

    setPosition(percentage);
    setMarginLeft(centerThumb);
    setProgressBarWidth(percentage);
  }, [percentage]);

  return (
    <div className={`${styles.slider}`}>
      <div
        className={`${styles.slider_progress}`}
        style={{ width: `${progressBarWidth}%` }}
      ></div>
      <div
        className={`${styles.slider_thumb} ${isMouseDown ? "active" : ""}`}
        ref={thumbRef}
        style={{ left: `${position}%`, marginLeft: `${marginLeft}px` }}
      ></div>
      <input
        type="range"
        value={position}
        ref={rangeRef}
        step="0.01"
        className={`${styles.slider_range}`}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onChange={onChange}
      />
    </div>
  );
};

export default Slider;
