"use client";
import { CardRoom } from "@/components/Card";
import ChatRoom from "@/components/ChatRoom";
import { SectionOneRow } from "@/components/Section";
import Slider from "@/components/Slider";
import TablePlaylist from "@/components/TablePlaylist";
import { TrackShort } from "@/components/Track";
import { ButtonIcon, ButtonIconRound } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import useInactivity from "@/hooks/useInactivity";
import { IMAGES, paths } from "@/lib/constants";
import {
  apiImage,
  formatImg,
  formatNumber,
  toggleFullScreen,
} from "@/lib/utils";
import imgBanner from "@/public/images/room-banner2.jpg";
import roomSerive from "@/services/room.service";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";

const RoomPage = () => {
  const [openChat, setOpenChat] = React.useState(true);
  const { isWaitingOpen, toggleWaiting, togglePlayingBar } = useUI();
  const swapperRef = React.useRef<HTMLDivElement>(null);
  const isInactive = useInactivity(5000); // Bắt sự kiện khi không hoạt động trong 5s
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // luôn tắc waiting khi mở room
  useEffect(() => {
    if (isWaitingOpen) toggleWaiting();
    togglePlayingBar(false);
  });

  const handleBlack = () => {
    window.history.back();
  };

  const { data: room } = useQuery({
    queryKey: ["Room", id],
    queryFn: async () => {
      const res = await roomSerive.getById(id);
      return res.data;
    },
  });

  const { data: songs } = useQuery({
    queryKey: ["Room", id, "songs"],
    queryFn: async () => {
      const res = await roomSerive.getAllSong(id);
      return res.data;
    },
  });

  return (
    <div className={`${styles.RoomPage}`}>
      <div className={`${styles.top}`}>
        <div className={`${styles.content}`}>
          <div className={`${styles.swapper}`}>
            {/* Banner */}
            <div
              ref={swapperRef}
              className={`${styles.body}`}
              style={{
                backgroundImage: `url(${
                  room?.imagePath
                    ? formatImg(apiImage(room?.imagePath))
                    : formatImg(imgBanner)
                })`,
                cursor: isInactive ? "none" : "default",
              }}
            >
              <div className={`${styles.content}`}>
                <h4>SONG IS PLAYING:</h4>
                <div className={`${styles.item}`}>
                  {songs?.length && <TrackShort song={songs[0]} dontShowPlay />}
                </div>
                <div className={styles.overlay}></div>
              </div>

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

            {/* Info */}
            <div className={`${styles.info}`}>
              <div>
                <Link href={`${paths.ARTIST}/${room?.creator?.slug}`} passHref>
                  <Image
                    src={
                      room?.creator?.imagePath
                        ? apiImage(room?.creator?.imagePath)
                        : IMAGES.AVATAR
                    }
                    width={50}
                    height={50}
                    alt="author.png"
                  />
                </Link>
                <div>
                  <h6>{room?.title}</h6>
                  <Link
                    href={`${paths.ARTIST}/${room?.creator?.slug}`}
                    passHref
                  >
                    <h4>{room?.creator?.name}</h4>
                  </Link>
                </div>
              </div>
              <div>
                <div className={`${styles.quantity}`}>
                  <i className="fa-solid fa-user-vneck"></i>
                  <span>{formatNumber(room?.membersCount ?? 0)}</span>
                </div>
              </div>
            </div>

            {/* Songs */}
            <div>{songs && <TablePlaylist data={songs} />}</div>
          </div>
        </div>

        {/* Chat */}
        {openChat && (
          <div className={`${styles.chat}`}>
            <ChatRoom onClose={() => setOpenChat(false)} />
          </div>
        )}
      </div>

      <div className={`${styles.bottom}`}>
        <SectionOneRow title="Rooms" path={paths.ROOM}>
          {Array.from({ length: 10 }).map(
            (_, index) =>
              room && <CardRoom id={index + 1} key={index} room={room} />
          )}
        </SectionOneRow>
      </div>
    </div>
  );
};

export default RoomPage;
