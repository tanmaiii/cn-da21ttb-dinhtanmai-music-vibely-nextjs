"use client";
import { CardRoom } from "@/components/Card";
import ChatRoom from "@/components/ChatRoom";
import FormEnterRoom from "@/components/Form/FormEnterRoom";
import Modal from "@/components/Modal";
import { SectionOneRow } from "@/components/Section";
import Slider from "@/components/Slider";
import TablePlaylist from "@/components/TablePlaylist";
import { Track, TrackShort } from "@/components/Track";
import { ButtonIcon, ButtonIconRound } from "@/components/ui/Button";
import IconPlay from "@/components/ui/IconPlay";
import { useUI } from "@/context/UIContext";
import useInactivity from "@/hooks/useInactivity";
import { useCustomToast } from "@/hooks/useToast";
import apiConfig from "@/lib/api";
import { IMAGES, paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import {
  apiImage,
  formatImg,
  formatNumber,
  toggleFullScreen,
} from "@/lib/utils";
import imgBanner from "@/public/images/room-banner2.jpg";
import {
  default as roomSerive,
  default as roomService,
} from "@/services/room.service";
import { socket } from "@/services/socket.service";
import { ISong } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "./loading";
import styles from "./style.module.scss";

const RoomPage = () => {
  const [openChat, setOpenChat] = useState(true);
  const { isWaitingOpen, toggleWaiting, togglePlayingBar } = useUI();
  const swapperRef = useRef<HTMLDivElement>(null);
  const isInactive = useInactivity(5000);
  const params = useParams();
  const router = useRouter();
  const roomId = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentUser = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const { toastError } = useCustomToast();
  const [volume, setVolume] = useState(50);

  const { data: rooms } = useQuery({
    queryKey: ["room"],
    queryFn: async () => {
      const res = await roomSerive.getAll({ page: 1, sort: "mostLikes" });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: isMember } = useQuery({
    queryKey: ["room-check", roomId],
    queryFn: async () => {
      const res = roomId && (await roomService.checkMember(roomId));
      return res ? res.data : false;
    },
  });

  useEffect(() => {
    if (isWaitingOpen) toggleWaiting();
    togglePlayingBar(false);
  }, [isWaitingOpen, toggleWaiting, togglePlayingBar]);

  // Lấy thông tin phòng
  const { data: room } = useQuery({
    queryKey: ["room", roomId, isMember],
    queryFn: async () => {
      if (isMember) {
        const res = await roomSerive.getById(roomId);
        return res && res.data;
      }
    },
  });

  // Lấy danh sách bài hát trong phòng
  const {
    data: songs,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["room", roomId, "songs"],
    queryFn: async () => {
      const res = await roomSerive.getAllSong(roomId);
      return res.data;
    },
  });

  // Thêm người dùng vào phòng
  const mutionAddMember = useMutation({
    mutationFn: async (password?: string) => {
      return (
        roomId &&
        currentUser &&
        (await roomService.addMember(roomId, {
          userId: currentUser.id,
          password: password,
        }))
      );
    },
    onSuccess: () => {
      router.push(`${paths.ROOM}/${roomId}`);
      queryClient.invalidateQueries({ queryKey: ["room-check", roomId] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
    },
    onError: (error) => {
      toastError((error as Error)?.message || "Login failed");
    },
  });

  // Phát bài hát
  const handlePlaySong = (song: ISong) => {
    if (currentUser?.id !== room?.creator.id) return;
    if (currentUser) {
      socket.emit("playSong", roomId, currentUser.id, song.id);
    }
  };

  if (isLoading) return <Loading />;

  if (isError) return notFound();

  return (
    <div className={`${styles.RoomPage}`}>
      {isMember === false ? (
        <Modal show={true} onClose={() => router.push(paths.ROOM)}>
          <FormEnterRoom
            onClose={() => router.push(paths.ROOM)}
            onSubmit={(password) => mutionAddMember.mutate(password)}
          />
        </Modal>
      ) : (
        <>
          <div className={`${styles.top}`}>
            {/* col pc-8 t-7 m-12 */}
            <div className={`${styles.content} `}>
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
                    {/* <div className={`${styles.item}`}> */}
                    {roomId && songs && (
                      <SongPlaying
                        songs={songs}
                        roomId={roomId}
                        volume={volume}
                      />
                    )}
                    {/* </div> */}
                    <div className={styles.overlay}></div>
                  </div>

                  {!isInactive && (
                    <div className={`${styles.header}`}>
                      <div className={`${styles.left}`}>
                        <ButtonIconRound
                          onClick={() => router.push(paths.ROOM)}
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
                          {volume ? (
                            <ButtonIcon
                              onClick={() => setVolume(0)}
                              icon={<i className="fa-light fa-volume"></i>}
                            />
                          ) : (
                            <ButtonIcon
                              onClick={() => {
                                if (volume === 0) {
                                  setVolume(50);
                                } else {
                                  setVolume(volume);
                                }
                              }}
                              icon={<i className="fa-light fa-volume-mute"></i>}
                            />
                          )}
                          <div className={`${styles.btn_volumn_range}`}>
                            <Slider
                              percentage={volume}
                              onChange={(e) =>
                                setVolume(parseFloat(e.target.value))
                              }
                            />
                          </div>
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
                    <Link
                      href={`${paths.ARTIST}/${room?.creator?.slug}`}
                      passHref
                    >
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
                    {/* <ButtonIconRound
                      onClick={() => songs && handlePlaySong(songs[0].id)}
                      dataTooltip="Close"
                      icon={<i className="fa-solid fa-play"></i>}
                    /> */}
                    <div className={`${styles.quantity}`}>
                      <i className="fa-solid fa-user-vneck"></i>
                      <span>{formatNumber(room?.membersCount ?? 0)}</span>
                    </div>
                    <ButtonIconRound
                      icon={<i className="fa-solid fa-ellipsis"></i>}
                    />
                  </div>
                </div>

                {/* Songs */}
                <div>
                  {songs && (
                    <TablePlaylist
                      data={songs}
                      renderItem={(item, index) => (
                        <Track
                          key={index}
                          song={item}
                          onPlay={handlePlaySong}
                        />
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Chat */}
            {openChat && (
              //  col pc-4 t-5 m-12
              <div className={`${styles.chat}`}>
                {room && (
                  <ChatRoom room={room} onClose={() => setOpenChat(false)} />
                )}
              </div>
            )}
          </div>

          <div className={`${styles.bottom} `}>
            <SectionOneRow title="Rooms" path={paths.ROOM}>
              {rooms &&
                rooms.map((_, index) => {
                  if (_.id !== roomId) {
                    return <CardRoom key={index} room={_} />;
                  }
                })}
            </SectionOneRow>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;

const SongPlaying = ({
  roomId,
  songs,
  volume,
}: {
  songs: ISong[];
  roomId: string;
  volume: number;
}) => {
  const [songPlaying, setSongPlaying] = useState<ISong | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const { toastSuccess } = useCustomToast();
  const [startTimer, setStartTimer] = useState<string>();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlaySong = useCallback(
    (songId: string) => {
      if (currentUser) socket.emit("playSong", roomId, currentUser.id, songId);
    },
    [currentUser, roomId]
  );

  const {} = useQuery({
    queryKey: ["room", roomId, "currentSong"],
    queryFn: async () => {
      const res = await roomSerive.getSongPlaying(roomId);
      console.log(res.data);

      setSongPlaying(res.data.song);
      setStartTimer(res.data.startedAt);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    // if (startTimer) {
    //   const timer = setInterval(() => {
    //     const start = new Date(startTimer).getTime();
    //     const now = new Date().getTime();
    //     const diff = now - start;
    //     const time = new Date(diff);
    //     console.log(time);
    //   }, 1000);
    //   return () => {
    //     clearInterval(timer);
    //   };
    // }
  }, [startTimer]);

  useEffect(() => {
    if (!songPlaying) {
      if (songs.length > 0) {
        handlePlaySong(songs[0]?.id);
      }
    }
  }, [handlePlaySong, songPlaying, songs]);

  // Đảm bảo người dùng đã tương tác với trang
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };
    document.addEventListener("click", handleUserInteraction);
    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Người dùng tham gia phòng chat
    socket.emit("joinRoom", roomId, currentUser?.id);

    socket.on("playReceived", (song: ISong) => {
      toastSuccess("Playing song");
      setSongPlaying(song);
    });

    return () => {
      socket.off("playReceived");
    };
  }, [roomId, currentUser, toastSuccess]);

  useEffect(() => {
    if (audioRef.current && songPlaying && userInteracted) {
      audioRef.current.src = apiConfig.audioURL(songPlaying.songPath || "");
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    }
  }, [songPlaying, userInteracted]);

  const onPlaying = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime) {
      setDuration(audioRef.current.duration);
      setCurrentTime(audio.currentTime);
    }
  };

  const onEnd = () => {
    const index = songs.findIndex((song) => song.id === songPlaying?.id);

    if (index < songs.length - 1) {
      handlePlaySong(songs[index + 1].id);
    } else {
      handlePlaySong(songs[0].id);
    }

    // if (currentUser) socket.emit("nextSong", roomId, currentUser.id);

    // if (audioRef.current) {
    //   audioRef.current.currentTime = 0;
    // }
  };

  if (!songPlaying) return null;

  return (
    <div
      className={`${styles.songPlaying}`}
      onClick={() => audioRef.current?.play()}
    >
      <div className={`${styles.songInfo}`}>
        <TrackShort song={songPlaying} dontShowPlay />
        <div className={`${styles.timer}`}>
          <div
            style={{ width: (currentTime / duration) * 100 + "%" }}
            className={`${styles.timerPlay}`}
          ></div>
        </div>
      </div>
      <IconPlay playing />
      <audio
        ref={audioRef}
        onTimeUpdate={onPlaying}
        onEnded={onEnd}
        src={songPlaying ? apiConfig.audioURL(songPlaying.songPath) : ""}
      ></audio>
    </div>
  );
};
