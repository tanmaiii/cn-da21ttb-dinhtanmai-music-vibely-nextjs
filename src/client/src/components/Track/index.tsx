"use client";

import { usePlayer } from "@/context/PlayerContext";
import { IMAGES, paths } from "@/lib/constants";
import {
  apiImage,
  fadeIn,
  formatDateTime,
  formatDuration,
  formatNumber,
  padNumber,
} from "@/lib/utils";
import songService from "@/services/song.service";
import { IArtist, IPlaylist, ISong } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { MotionDiv } from "../Motion";
import { ButtonIcon, ButtonIconRound } from "../ui/Button";
import IconPlay from "../ui/IconPlay";
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import { closeMenu, openMenu } from "@/features/menuSongSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import artistService from "@/services/artist.service";

interface Props {
  num?: number;
  isLoading?: boolean;
}

interface ITrack extends Props {
  primary?: boolean;
  dontShowPlay?: boolean;
  song: ISong;
  playlist?: IPlaylist;
  addSoong?: (song: ISong) => void;
  removeSong?: (song: ISong) => void;
  onPlay?: (song: ISong) => void;
}

interface ITrackArtist extends Props {
  artist: IArtist;
}

const Track = (props: ITrack) => {
  const { num, primary, isLoading = false, song, addSoong, removeSong } = props;
  const queryClient = useQueryClient();
  const { currentSong, isPlaying } = usePlayer();
  const dispatch = useDispatch();
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const btnRef = useRef<HTMLButtonElement>(null);

  const { data: liked } = useQuery({
    queryKey: ["song", song.id],
    queryFn: async () => {
      try {
        const res = await songService.checkLiked(song.id);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const mutationLiked = useMutation({
    mutationFn: async (like: boolean) => {
      try {
        if (like) {
          await songService.unLikeSong(song.id);
        } else {
          await songService.likeSong(song.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song", song.id] });
      queryClient.invalidateQueries({ queryKey: ["song-favorites"] });
    },
  });

  const handleClickPlay = () => {
    if (props.onPlay) {
      props.onPlay(song);
    }
  };

  function handleClickOpenMenu() {
    if (menuSong.open) {
      dispatch(closeMenu());
      return;
    }
    const rect = btnRef?.current?.getBoundingClientRect();
    if (rect) {
      dispatch(
        openMenu({
          open: true,
          song,
          playlist: props.playlist,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        })
      );
    }
  }

  return (
    <MotionDiv
      variants={fadeIn({ direction: "up", delay: 0.2 })}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: true }}
      aria-disabled={isLoading}
      className={`${styles.Track}`}
    >
      <div
        aria-disabled={isLoading}
        className={`${styles.Track_swapper} row no-gutters`}
      >
        <div className={`${styles.Track_swapper_col1} pc-6 t-6 m-8`}>
          {!isLoading && num && (
            <div
              className={`${styles.Track_swapper_col1_num} ${
                primary ? styles.Track_swapper_col1_num_main : ""
              }`}
            >
              <h4>{isLoading ? <Skeleton width={20} /> : num}</h4>
              <div className={`${styles.line}`}></div>
            </div>
          )}
          <div className={`${styles.Track_swapper_col1_image}`}>
            {isLoading ? (
              <Skeleton height={60} width={60} />
            ) : (
              <Image
                src={song.imagePath ? apiImage(song.imagePath) : IMAGES.SONG}
                alt="image.png"
                width={50}
                height={50}
                quality={90}
              />
            )}
            {props?.onPlay && (
              <button
                onClick={handleClickPlay}
                className={`${styles.button_play} ${
                  currentSong?.id === song?.id ? styles.button_play_playing : ""
                }`}
              >
                {isPlaying && currentSong?.id === song?.id ? (
                  <IconPlay playing={isPlaying} />
                ) : (
                  <i className="fa-solid fa-play"></i>
                )}
              </button>
            )}
          </div>
          <div className={`${styles.Track_swapper_col1_desc}`}>
            <h4>
              {isLoading ? (
                <Skeleton width={"40%"} />
              ) : (
                <Link href={`${paths.SONG}/${song.slug}`}>{song.title}</Link>
              )}
            </h4>
            {isLoading ? (
              <Skeleton width={"70%"} height={20} />
            ) : (
              <p>
                {/* {song?.owner.map((owner, index) => (
                  <Link key={index} href={`${paths.ARTIST}/${owner?.id || 1}`}>
                    {owner?.name}
                  </Link>
                ))} */}
                <Link href={`${paths.ARTIST}/${song?.creator?.slug || 1}`}>
                  {song?.creator?.name}
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className={`${styles.Track_swapper_col2} pc-2 t-2 m-0`}>
          <span>
            {isLoading ? (
              <Skeleton width={50} />
            ) : (
              formatDateTime(new Date(song.createdAt)).dateOnly
            )}
          </span>
        </div>
        <div className={`${styles.Track_swapper_col3} pc-2 t-2 m-0`}>
          <span>
            {isLoading ? <Skeleton width={60} /> : formatNumber(song.listens)}
          </span>
        </div>
        <div className={`${styles.Track_swapper_col4} pc-2 t-2 m-4`}>
          <div className={`${liked ? styles.item_default : styles.item_hover}`}>
            {liked ? (
              <ButtonIcon
                onClick={() => mutationLiked.mutate(liked)}
                className={`${styles.icon_liked}`}
                icon={<i className="fa-solid fa-heart"></i>}
              />
            ) : (
              <ButtonIcon
                onClick={() => mutationLiked.mutate(false)}
                icon={<i className="fa-light fa-heart"></i>}
              />
            )}
          </div>

          <div className={`${styles.item_default}`}>
            <span>
              {isLoading ? (
                <Skeleton width={50} />
              ) : song?.duration ? (
                formatDuration(parseInt(song?.duration.toString()))
              ) : (
                "00:00"
              )}
            </span>
          </div>

          <div className={`${styles.item_hover}`}>
            {addSoong ? (
              <ButtonIconRound
                onClick={() => props.addSoong && props.addSoong(props.song)}
                icon={<i className="fa-solid fa-plus"></i>}
              />
            ) : removeSong ? (
              <ButtonIconRound
                onClick={() => removeSong && removeSong(props.song)}
                icon={<i className="fa-solid fa-minus"></i>}
              />
            ) : (
              <>
                {/* <ButtonIconRound
                  ref={btnRef}
                  onClick={handleClickOpenMenu}
                  icon={<i className="fa-solid fa-ellipsis"></i>}
                /> */}
                <button
                  className={`${styles.button_menu}`}
                  ref={btnRef}
                  onClick={handleClickOpenMenu}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const TrackShort = (props: ITrack) => {
  const { num, isLoading, song, dontShowPlay = false } = props;
  const { isPlaying, play, currentSong, pause } = usePlayer();
  const queryClient = useQueryClient();
  const btnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const { data: liked } = useQuery({
    queryKey: ["song", song.id],
    queryFn: async () => {
      try {
        const res = await songService.checkLiked(song.id);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const mutationLiked = useMutation({
    mutationFn: async (like: boolean) => {
      try {
        if (like) {
          await songService.unLikeSong(song.id);
        } else {
          await songService.likeSong(song.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song", song.id] });
      queryClient.invalidateQueries({ queryKey: ["song-favorites"] });
    },
  });

  const handleClickPlay = () => {
    if (currentSong?.id === song?.id && isPlaying) {
      pause();
      return;
    }
    play(song);
  };

  const handleClickOpenMenu = () => {
    const rect = btnRef?.current?.getBoundingClientRect();
    if (rect) {
      dispatch(
        openMenu({
          open: true,
          song,
          playlist: props.playlist,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        })
      );
    }
  };

  return (
    <div aria-disabled={isLoading} className={`${styles.TrackShort}`}>
      <div className={`${styles.TrackShort_swapper}`}>
        <div className={`${styles.TrackShort_swapper_left}`}>
          {!isLoading && num && (
            <div className={`${styles.TrackShort_swapper_left_num}`}>
              <h2>{padNumber(num)}</h2>
              <div className={`${styles.line}`}></div>
            </div>
          )}
          <div className={`${styles.TrackShort_swapper_left_image}`}>
            {isLoading || !song ? (
              <Skeleton height={50} width={50} />
            ) : (
              <Image
                src={song?.imagePath ? apiImage(song.imagePath) : IMAGES.SONG}
                alt="song"
                quality={90}
                width={50}
                height={50}
              />
            )}
            {!dontShowPlay && (
              <button
                onClick={handleClickPlay}
                className={`${styles.button_play} ${
                  currentSong?.id === song?.id ? styles.button_play_playing : ""
                }`}
              >
                {isPlaying && currentSong?.id === song?.id ? (
                  <IconPlay playing={isPlaying} />
                ) : (
                  <i className="fa-solid fa-play"></i>
                )}
              </button>
            )}
          </div>
          <div className={`${styles.TrackShort_swapper_left_desc}`}>
            {isLoading ? (
              <>
                <Skeleton width={"50%"} />
                <Skeleton width={"30%"} />
              </>
            ) : (
              <>
                <h4>
                  <Link href={paths.SONG + "/" + song?.slug}>
                    {song?.title}
                  </Link>
                </h4>
                <p>
                  <Link href={`${paths.ARTIST}/${song?.creator?.slug || 1}`}>
                    {song?.creator?.name}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
        <div className={`${styles.TrackShort_swapper_right}`}>
          <div className={`${liked ? styles.item_active : styles.item_hover}`}>
            {liked ? (
              <ButtonIcon
                onClick={() => mutationLiked.mutate(liked)}
                className={`${styles.icon_liked}`}
                icon={<i className="fa-solid fa-heart"></i>}
              />
            ) : (
              <ButtonIcon
                onClick={() => mutationLiked.mutate(false)}
                icon={<i className="fa-light fa-heart"></i>}
              />
            )}
          </div>
          <div className={`${styles.item_hover}`}>
            {/* <ButtonIconRound
              size="small"
              icon={<i className="fa-solid fa-ellipsis"></i>}
            /> */}

            <button
              className={`${styles.button_menu}`}
              ref={btnRef}
              onClick={handleClickOpenMenu}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <div className={`${styles.item_default}`}>
            <span className={`${styles.item_default_time}`}>
              {isLoading ? <Skeleton width={60} /> : formatNumber(song.listens)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackArtist = (props: ITrackArtist) => {
  const { artist, isLoading = false } = props;
  const currentUser = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: isFollow } = useQuery({
    queryKey: ["artist-follow", artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.checkFollow(artist?.id);
      return res.data;
    },
  });

  const mutationFollow = useMutation({
    mutationFn: async (isFollow: boolean) => {
      if (!artist) return;
      if (isFollow) {
        const res = await artistService.unFollow(artist.id);
        return res.data;
      } else {
        const res = await artistService.follow(artist.id);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-follow", artist] });
      queryClient.invalidateQueries({ queryKey: ["artist", artist?.slug] });
    },
  });

  return (
    <div aria-disabled={isLoading} className={`${styles.TrackArtist}`}>
      <div className={`${styles.TrackArtist_swapper}`}>
        <div className={`${styles.TrackArtist_swapper_left}`}>
          <div className={`${styles.TrackArtist_swapper_left_image}`}>
            {isLoading ? (
              <Skeleton height={"100%"} circle />
            ) : (
              <Image
                src={
                  artist?.imagePath
                    ? apiImage(artist?.imagePath)
                    : IMAGES.AVATAR
                }
                alt="song"
                quality={90}
                width={50}
                height={50}
              />
            )}
          </div>
          <div className={`${styles.TrackArtist_swapper_left_desc}`}>
            {isLoading ? <Skeleton width={50} /> : <p>Artist</p>}
            {isLoading ? <Skeleton width={100} /> : <h4>{artist?.name}</h4>}
          </div>
        </div>
        <div className={`${styles.TrackArtist_swapper_right}`}>
          <div className={`${styles.item_hover}`}>
            {/* <ButtonIconRound icon={<i className="fa-solid fa-heart"></i>} /> */}
            {currentUser && currentUser.id !== artist?.id && (
              <button
                onClick={() => mutationFollow.mutate(isFollow || false)}
                className={styles.btn_follow}
              >
                {isFollow ? (
                  <>
                    <span className={styles.btn_folowing}>Following</span>
                    <span className={styles.btn_folowing}>Unfollow</span>
                  </>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            )}
            {/* <ButtonIconRound icon={<i className="fa-solid fa-ellipsis"></i>} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Track, TrackArtist, TrackShort };
