"use client";
import { HeaderPage } from "@/components/HeaderPage";
import { Track, TrackArtist } from "@/components/Track";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { usePlayer } from "@/context/PlayerContext";
import { navSongPage } from "@/lib/constants";
import songService from "@/services/song.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, notFound } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./style.module.scss";
import Loading from "./loading";
import TablePlaylist from "@/components/TablePlaylist";
import { useCustomToast } from "@/hooks/useToast";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeMenu, openMenu } from "@/features/menuSongSlice";

const SongPage = () => {
  const { toastSuccess } = useCustomToast();
  const [nav, setNav] = useState("About");
  const { play } = usePlayer();
  const [seeMore, setSeeMore] = useState(false);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const queryClient = useQueryClient();
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const dispatch = useDispatch();
  const btnRef = useRef<HTMLButtonElement>(null);

  const {
    data: song,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["song", slug],
    queryFn: async () => {
      const res = await songService.getBySlug(slug);
      return res.data;
    },
  });

  const { data: liked } = useQuery({
    queryKey: ["song", song?.id],
    queryFn: async () => {
      if (!song) return;
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
          if (song) {
            await songService.unLikeSong(song.id);
          }
        } else {
          if (song) {
            await songService.likeSong(song.id);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      if (song) {
        toastSuccess(liked ? "Remove from favorite" : "Add to favorite");
        queryClient.invalidateQueries({ queryKey: ["song", song.id] });
        queryClient.invalidateQueries({ queryKey: ["song-favorites"] });
      }
    },
  });

  const { data: lyrics } = useQuery({
    queryKey: ["lyrics", song],
    queryFn: async () => {
      if (song) {
        const res = await songService.getLyic(song.id);
        return res.data;
      }
    },
  });

  const { data: songs } = useQuery({
    queryKey: ["songs", song],
    queryFn: async () => {
      if (song) {
        const res = await songService.getAllSong({
          page: 1,
          limit: 10,
          genreId: song.genre?.id,
        });
        return res.data.data.filter((item) => item.id !== song.id);
      }
    },
  });

  const handlePlay = () => {
    if (song) play(song);
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

  if (isLoading) return <Loading />;

  if (!slug || isError) return notFound();

  return (
    <div className={`${styles.SongPage}`}>
      <div className={`${styles.SongPage_header}`}>
        {song && <HeaderPage data={song} />}
      </div>
      <div className={`${styles.SongPage_content}`}>
        <div className={`${styles.SongPage_content_header}`}>
          <ButtonIconPrimary
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
            onClick={() => handlePlay()}
          />
          <ButtonIcon
            size="large"
            onClick={() => mutationLiked.mutate(liked || false)}
            icon={
              liked ? (
                <i
                  style={{ color: "#ff6337" }}
                  className="fa-solid fa-heart"
                ></i>
              ) : (
                <i
                  style={{ color: "#ff6337" }}
                  className="fa-light fa-heart"
                ></i>
              )
            }
          />
          {/* <ButtonIcon
            onClick={handleClickOpenMenu}
            ref={btnRef}
            size="large"
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
        <div className={`${styles.SongPage_content_nav}`}>
          <div className={`${styles.SongPage_content_nav_list}`}>
            {navSongPage.map((item, index) => (
              <button
                key={index}
                onClick={() => setNav(() => item.name)}
                className={`${nav === item.name ? styles.active : ""}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className={`${styles.SongPage_content_body}`}>
          {nav == "About" && (
            <div className={`${styles.SongPage_content_body_about}`}>
              <div
                className={`${styles.SongPage_content_body_about_author} row`}
              >
                {/* {artists.slice(0, 5).map((_, index) => (
                  <div key={index} className="col pc-3 t-4 m-6">
                    <TrackArtist artist={_} />
                  </div>
                ))} */}
                {song?.creator && (
                  <div className="col pc-3 t-4 m-6">
                    <TrackArtist artist={song?.creator} />{" "}
                  </div>
                )}
              </div>

              <div className={`${styles.SongPage_content_body_about_genre}`}>
                <h4>Genre</h4>
                <div
                  className={`${styles.SongPage_content_body_about_genre_list}`}
                >
                  <button>{song?.genre?.title}</button>
                </div>
              </div>

              {song?.moods && song?.moods?.length > 1 && (
                <div className={`${styles.SongPage_content_body_about_moods}`}>
                  <h4>Moods</h4>
                  <div
                    className={`${styles.SongPage_content_body_about_moods_list}`}
                  >
                    {song?.moods?.map((item, index) => (
                      <button key={index}>{item.title}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {nav == "Lyrics" && (
            <div className={`${styles.SongPage_content_body_lyrics}`}>
              {lyrics ? (
                <div className={`${styles.SongPage_content_body_lyrics_list}`}>
                  {lyrics.slice(0, 10).map((item, index) => (
                    <p key={index}> {item.text}</p>
                  ))}
                  {seeMore &&
                    lyrics
                      .slice(10, lyrics.length)
                      .map((item, index) => <p key={index}> {item.text}</p>)}
                  <button onClick={() => setSeeMore(!seeMore)}>
                    <span>{seeMore ? "Hide" : "...See more"}</span>
                  </button>
                </div>
              ) : (
                <div className={styles.SongPage_content_body_lyrics_list}>
                  <p>No lyrics </p>
                </div>
              )}
            </div>
          )}

          {nav == "Comments" && (
            <div className={`${styles.SongPage_content_body_comments}`}>
              <div
                className={`${styles.SongPage_content_body_comments_list}`}
              ></div>
            </div>
          )}

          {nav == "Similar Songs" && (
            <div className={`${styles.SongPage_content_body_similar}`}>
              {songs && (
                <TablePlaylist
                  data={songs}
                  renderItem={(item) => <Track song={item} />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongPage;
