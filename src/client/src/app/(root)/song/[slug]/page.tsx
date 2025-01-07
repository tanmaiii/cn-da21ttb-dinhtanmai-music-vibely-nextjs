"use client";
import { HeaderPage } from "@/components/HeaderPage";
import { TrackArtist } from "@/components/Track";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { usePlayer } from "@/context/PlayerContext";
import { navSongPage } from "@/lib/constants";
import { lyrics } from "@/lib/data";
import songService from "@/services/song.service";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const SongPage = () => {
  const [nav, setNav] = useState("About");
  const { play } = usePlayer();
  const [seeMore, setSeeMore] = useState(false);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: ["song", slug],
    queryFn: async () => {
      const res = await songService.getBySlug(slug);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (error || !slug) return notFound();

  const handlePlay = () => {
    console.log("play");

    if (data) play(data);
  };

  return (
    <div className={`${styles.SongPage}`}>
      <div className={`${styles.SongPage_header}`}>
        {data && <HeaderPage data={data} />}
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
            icon={
              <i style={{ color: "#ff6337" }} className="fa-solid fa-heart"></i>
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
                {data?.creator && (
                  <div className="col pc-3 t-4 m-6">
                    <TrackArtist artist={data?.creator} />{" "}
                  </div>
                )}
              </div>

              <div className={`${styles.SongPage_content_body_about_genre}`}>
                <h4>Genre</h4>
                <div
                  className={`${styles.SongPage_content_body_about_genre_list}`}
                >
                  <button>{data?.genre?.title}</button>
                </div>
              </div>

              {data?.moods && data?.moods?.length > 1 && (
                <div className={`${styles.SongPage_content_body_about_moods}`}>
                  <h4>Moods</h4>
                  <div
                    className={`${styles.SongPage_content_body_about_moods_list}`}
                  >
                    {data?.moods?.map((item, index) => (
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
