"use client";
import { CardRoom } from "@/components/Card";
import ChatRoom from "@/components/ChatRoom";
import { SectionOneRow } from "@/components/Section";
import Slider from "@/components/Slider";
import Table from "@/components/TablePlaylist";
import { TrackShort } from "@/components/Track";
import { ButtonIcon, ButtonIconRound } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import useInactivity from "@/hooks/useInactivity";
import { rooms, songs } from "@/lib/data";
import { toggleFullScreen } from "@/lib/utils";
import imgBanner from "@/public/images/room-banner2.jpg";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";
import styles from "./style.module.scss";

const RoomPage = () => {
  const [openChat, setOpenChat] = React.useState(true);
  const { isWaitingOpen, toggleWaiting, togglePlayingBar } = useUI();
  const swapperRef = React.useRef<HTMLDivElement>(null);
  const isInactive = useInactivity(5000); // Bắt sự kiện khi không hoạt động trong 5s

  // luôn tắc waiting khi mở room
  useEffect(() => {
    if (isWaitingOpen) toggleWaiting();
    togglePlayingBar(false);
  });

  const handleBlack = () => {
    window.history.back();
  };

  return (
    <div className={`${styles.RoomPage}`}>
      <div className={`${styles.top}`}>
        <div className={`${styles.content}`}>
          <div className={`${styles.swapper}`}>
            <div
              ref={swapperRef}
              className={`${styles.body}`}
              style={{
                backgroundImage: `url(${imgBanner.src})`,
                cursor: isInactive ? "none" : "default",
              }}
            >
              {!isInactive && (
                <div className={`${styles.header}`}>
                  <div className={`${styles.left}`}>
                    <ButtonIconRound
                      onClick={handleBlack}
                      dataTooltip="Black"
                      icon={
                        <i
                          style={{ color: "white" }}
                          className="fa-solid fa-chevron-left"
                        ></i>
                      }
                    />
                  </div>
                  <div className={`${styles.right}`}>
                    <ButtonIcon
                      dataTooltip="Share"
                      icon={
                        <i
                          style={{ color: "white" }}
                          className="fa-solid fa-share"
                        ></i>
                      }
                    />

                    {!openChat && (
                      <ButtonIcon
                        dataTooltip="Open chat"
                        hide={openChat ? true : false}
                        onClick={() => setOpenChat(true)}
                        icon={
                          <i
                            style={{ color: "white" }}
                            className="fa-sharp fa-solid fa-left-to-line"
                          ></i>
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              <div className={`${styles.content}`}>
                <h4>SONG IS PLAYING:</h4>
                <div className={`${styles.item}`}>
                  <TrackShort song={songs[2]} />
                </div>
              </div>

              {!isInactive && (
                <div className={`${styles.footer}`}>
                  <div className={`${styles.left}`}>
                    <div className={`${styles.buttonLive}`}>
                      <div></div>
                      Live
                    </div>
                  </div>
                  <div className={`${styles.right}`}>
                    <div className={`${styles.btn_auto}`}></div>
                    <div className={`${styles.btn_volumn}`}>
                      <ButtonIcon
                        className={`${styles.btn_volumn_icon}`}
                        icon={
                          <i
                            style={{ color: "white" }}
                            className="fa-light fa-volume"
                          ></i>
                        }
                      />
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        className={`${styles.btn_volumn_range}`}
                      >
                        <Slider percentage={50} onChange={() => {}} />
                      </motion.div>
                    </div>
                    <ButtonIcon
                      onClick={() =>
                        swapperRef.current &&
                        toggleFullScreen(swapperRef.current)
                      }
                      icon={
                        <i
                          style={{ color: "white" }}
                          className="fa-regular fa-expand"
                        ></i>
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={`${styles.info}`}>
              <div>
                <Image
                  src="https://picsum.photos/200/300"
                  width={50}
                  height={50}
                  alt="author.png"
                />
                <div>
                  <h6>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </h6>
                  <h4>Author</h4>
                </div>
              </div>
              <div>
                <div className={`${styles.quantity}`}>
                  <i className="fa-solid fa-user-vneck"></i>
                  <span>122M</span>
                </div>
              </div>
            </div>

            <div>
              <Table songs={songs} />
            </div>
          </div>
        </div>

        {openChat && (
          <div className={`${styles.chat}`}>
            <ChatRoom onClose={() => setOpenChat(false)} />
          </div>
        )}
      </div>

      <div className={`${styles.bottom}`}>
        <SectionOneRow title="Rooms">
          {Array.from({ length: 10 }).map((_, index) => (
            <CardRoom id={index + 1} key={index} room={rooms[0]} />
          ))}
        </SectionOneRow>
      </div>
    </div>
  );
};

export default RoomPage;
