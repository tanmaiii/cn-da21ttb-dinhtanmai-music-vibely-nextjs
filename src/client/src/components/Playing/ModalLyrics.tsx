"use client";
import { useUI } from "@/context/UIContext";
import useInactivity from "@/hooks/useInactivity";
import { lyrics, songs } from "@/lib/data";
import {
  apiImage,
  formatDuration,
  formatImg,
  toggleFullScreen,
} from "@/lib/utils";
import img from "@/public/images/anime.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonIconRound } from "../ui/Button";
import Slider from "../Slider";
import ControlsPlaying from "./ControlsPlaying";
import styles from "./style.module.scss";
import { usePlayer } from "@/context/PlayerContext";
import { IMAGES } from "@/lib/constants";
import { playSong } from "../../services/socket.service";
import { ISong } from "@/types";

const ModalLyrics = () => {
  const { isLyricsOpen, toggleLyrics } = useUI();
  const [active, setActive] = useState(1); // Bắt sự kiện khi click vào Lyrics hoặc Waiting
  const isInactive = useInactivity(5000); // Bắt sự kiện khi không hoạt động trong 5s
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { currentSong, play, pause, isPlaying } = usePlayer();

  // Hàm kiểm tra trạng thái toàn màn hình
  const checkFullscreenStatus = () => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  };

  // Lắng nghe sự kiện thay đổi trạng thái toàn màn hình
  useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreenStatus);
    document.addEventListener("webkitfullscreenchange", checkFullscreenStatus);
    document.addEventListener("msfullscreenchange", checkFullscreenStatus);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreenStatus);
      document.removeEventListener(
        "webkitfullscreenchange",
        checkFullscreenStatus
      );
      document.removeEventListener("msfullscreenchange", checkFullscreenStatus);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.ModalLyrics} ${
        isLyricsOpen && styles.ModalLyrics_open
      }`}
    >
      <div
        className={`${styles.ModalLyrics_container} ${
          isInactive && styles.isInactive
        }`}
      >
        <div className={`${styles.ModalLyrics_container_blur}`}>
          <div
            className={`${styles.image}`}
            style={{
              backgroundImage: `url(${
                currentSong?.imagePath
                  ? formatImg(apiImage(currentSong?.imagePath))
                  : ""
              })`,
            }}
          ></div>
          <div className={`${styles.overlay}`}></div>
        </div>
        <div className={`${styles.ModalLyrics_container_header}`}>
          <div className={`${styles.ModalLyrics_container_header_buttons}`}>
            <ButtonIconRound
              onClick={() =>
                containerRef.current && toggleFullScreen(containerRef.current)
              }
              icon={
                isFullScreen ? (
                  <i className="fa-regular fa-arrow-down-left-and-arrow-up-right-to-center"></i>
                ) : (
                  <i className="fa-regular fa-arrow-up-right-and-arrow-down-left-from-center"></i>
                )
              }
            />
            <ButtonIconRound
              onClick={toggleLyrics}
              icon={<i className="fa-regular fa-chevron-down"></i>}
            />
          </div>
          <div className={`${styles.ModalLyrics_container_header_navigation}`}>
            <ul>
              <li
                onClick={() => setActive(1)}
                className={`${active === 1 && styles.active}`}
              >
                <h4>Lyrics</h4>
              </li>
              <li
                onClick={() => setActive(2)}
                className={`${active === 2 && styles.active}`}
              >
                <h4>Waiting</h4>
              </li>
            </ul>
          </div>
        </div>
        <div className={`${styles.ModalLyrics_container_body}`}>
          {active === 1 ? <Lyrics /> : <Waiting />}
        </div>
        <div className={`${styles.ModalLyrics_container_footer}`}>
          <h6>{currentSong?.title}</h6>
          <div className={`${styles.ModalLyrics_container_footer_slider}`}>
            <span>{formatDuration(1232)}</span>
            <Slider percentage={50} onChange={() => {}} />
            <span>{formatDuration(1232)}</span>
          </div>
          <div className={`${styles.ModalLyrics_container_footer_controls}`}>
            <ControlsPlaying onPlay={() => (isPlaying ? pause() : play())} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Lyrics = () => {
  const { currentSong, isPlaying } = usePlayer();

  return (
    <div className={styles.Lyrics}>
      <div
        className={`${styles.Lyrics_image} ${
          isPlaying ? styles.Lyrics_image_active : ""
        }`}
      >
        <Image
          src={
            currentSong?.imagePath
              ? apiImage(currentSong?.imagePath)
              : IMAGES.SONG
          }
          alt="Lyrics"
          width={200}
          height={200}
        />
      </div>
      <div className={styles.Lyrics_list}>
        <ul>
          {lyrics.map((lyric, index) => (
            <li key={index} className={`${styles.is_over}`}>
              <p>{lyric.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Waiting = () => {
  const swapperRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const { queue } = usePlayer();
  const { currentSong, play } = usePlayer();

  const onClickLeft = () => {
    if (!queue) return;
    if (active - 1 >= 0) {
      setActive(active - 1);
    }
  };
  const onClickRight = () => {
    if (!queue) return;
    if (active + 1 < queue?.length) {
      setActive(active + 1);
    }
  };

  useEffect(() => {
    const slider = document.querySelector(".slider__track");
    const screenWidth = window.innerWidth;

    if (slider) {
      (slider as HTMLElement).style.transform = `translateX(${
        -1 * (360 * active) + screenWidth / 2
      }px)`;
    }
  }, [active]);

  useEffect(() => {
    if (!queue) return;
    queue.forEach((_, index) => {
      if (_ === currentSong) {
        setActive(index);
      }
    });
  }, [currentSong]);

  const handleClickPlay = ({ index, song }: { index: number; song: ISong }) => {
    setActive(index);
    play(song);
  };

  return (
    <div className={`${styles.Waiting}`}>
      <div className={`${styles.Waiting_swapper}`}>
        {queue.length > 0 && (
          <>
            <div className={`${styles.Waiting_swapper_button}`}>
              <button onClick={onClickLeft}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>
            <ul
              ref={swapperRef}
              className={`${styles.Waiting_swapper_slider} slider__track`}
            >
              {queue &&
                queue.map((song, index) => (
                  <li
                    onClick={() => handleClickPlay({ index, song })}
                    key={index}
                    className={`${styles.Waiting_swapper_slider_item} ${
                      active === index ? styles.active : ""
                    }`}
                  >
                    <div
                      className={`${styles.Waiting_swapper_slider_item_image}`}
                    >
                      <Image
                        src={
                          song.imagePath
                            ? apiImage(song.imagePath)
                            : IMAGES.SONG
                        }
                        alt={song.title}
                        width={200}
                        height={200}
                      />
                    </div>
                    <div
                      className={`${styles.Waiting_swapper_slider_item_info}`}
                    >
                      <h5>{song.title}</h5>
                      <p>{song?.creator?.name || "Vibely"}</p>
                    </div>
                  </li>
                ))}
            </ul>
            <div className={`${styles.Waiting_swapper_button}`}>
              <button onClick={onClickRight}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalLyrics;
