"use client";
import { HeaderPage } from "@/components/HeaderPage";
import { TrackArtist } from "@/components/Track";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { usePlayer } from "@/context/PlayerContext";
import { navSongPage } from "@/lib/constants";
import { lyrics } from "@/lib/data";
import songService from "@/services/song.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import styles from "./style.module.scss";
import Loading from "./loading";

const SongPage = () => {
  const [nav, setNav] = useState("About");
  const { play } = usePlayer();
  const [seeMore, setSeeMore] = useState(false);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries({ queryKey: ["song", song.id] });
        queryClient.invalidateQueries({ queryKey: ["song-favorites"] });
      }
    },
  });

  const handlePlay = () => {
    if (song) play(song);
  };

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
          <ButtonIcon
            size="large"
            icon={<i className="fa-solid fa-ellipsis"></i>}
          />
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
              <div className={`${styles.SongPage_content_body_lyrics_list}`}>
                {lyrics.slice(0, 10).map((item, index) => (
                  <p key={index}> {item.text}</p>
                ))}
                {seeMore &&
                  lyrics
                    .slice(10, lyrics.length)
                    .map((item, index) => <p key={index}> {item.text}</p>)}
                <button onClick={() => setSeeMore(!seeMore)}>
                  <span>{seeMore ? "Ẩn bớt" : "...Xem thêm"}</span>
                </button>
              </div>
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
              {/* <Table songs={songs} /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongPage;
