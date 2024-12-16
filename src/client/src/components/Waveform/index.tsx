"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  audioFile: string; // URL của file âm thanh
}

const Waveform = ({ audioFile }: WaveformProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Tạo một thể hiện của WaveSurfer
    const wavesurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#333",
      barWidth: 3,
      cursorWidth: 1,
      height: 128,
      hideScrollbar: true,
    });

    if (audioFile) {
      // Tải file âm thanh
      wavesurferInstance.load(audioFile);
    } else {
      return console.log("audioFile is null");
    }

    // Lưu instance vào state
    setWaveSurfer(wavesurferInstance);

    // Cleanup khi unmount component
    return () => {
      wavesurferInstance.destroy();
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    waveSurfer?.playPause();
  };

  return (
    <div>
      <div ref={waveformRef} id="waveform"></div>
      <button onClick={handlePlayPause}>Play/Pause</button>
    </div>
  );
};

export default Waveform;
