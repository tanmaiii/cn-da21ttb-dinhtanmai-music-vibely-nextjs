"use client";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { HeaderPage } from "@/components/HeaderPage";
import Table from "@/components/TablePlaylist";
import { TrackArtist } from "@/components/Track";
import { navSongPage } from "@/lib/constants";
import { artists, lyrics, songs } from "@/lib/data";
import React, { useEffect } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const SongPage = () => {
  const [seeMore, setSeeMore] = React.useState(false);
  const [isLoad, setIsLoad] = React.useState(true);

  const [nav, setNav] = React.useState(navSongPage[0].name);

  useEffect(() => {
    setTimeout(() => {
      setIsLoad(false);
    }, 3000);
  }, []);

  if (isLoad) {
    return <Loading />;
  }

  return (
    <div className={`${styles.SongPage}`}>
      <div className={`${styles.SongPage_header}`}>
        <HeaderPage data={songs[0]} />
      </div>
      <div className={`${styles.SongPage_content}`}>
        <div className={`${styles.SongPage_content_header}`}>
          <ButtonIconPrimary
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
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

          {nav == "About" && (
            <div className={`${styles.SongPage_content_body_about}`}>
              <div
                className={`${styles.SongPage_content_body_about_author} row`}
              >
                {artists.slice(0, 5).map((_, index) => (
                  <div key={index} className="col pc-3">
                    <TrackArtist artist={_} />
                  </div>
                ))}
              </div>

              <div className={`${styles.SongPage_content_body_about_genre}`}>
                <h4>Genre</h4>
                <div
                  className={`${styles.SongPage_content_body_about_genre_list}`}
                >
                  <button>Hip Hop</button>
                </div>
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
              <Table songs={songs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongPage;
