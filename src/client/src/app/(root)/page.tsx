"use client";

import { Card, CardArtist } from "@/components/Card";
import { SectionOneRow } from "@/components/Section";
import Slideshow from "@/components/Slideshow";
import { TrackShort } from "@/components/Track";
import { paths } from "@/lib/constants";
import artistService from "@/services/artist.service";
import playlistService from "@/services/playlist.service";
import songService from "@/services/song.service";
import { useQuery } from "@tanstack/react-query";
import styles from "./root.module.scss";
import Loading from "./loading";

const Home = () => {
  const { data: songsNew } = useQuery({
    queryKey: ["songs-new"],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 10,
        sort: "newest",
      });
      return res.data.data;
    },
  });

  const { data: songsPopular } = useQuery({
    queryKey: ["songs-pupular"],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 10,
        sort: "mostListens",
      });
      return res.data.data;
    },
  });

  const { data: songsLikes } = useQuery({
    queryKey: ["songs-likes"],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 10,
        sort: "mostLikes",
      });
      return res.data.data;
    },
  });

  const { data: playlists } = useQuery({
    queryKey: ["playlist"],
    queryFn: async () => {
      const res = await playlistService.getAll({
        page: 1,
        limit: 10,
        sort: "mostLikes",
      });
      return res.data.data;
    },
  });

  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await artistService.getAll({
        page: 1,
        limit: 10,
        sort: "mostLikes",
      });
      return res.data.data;
    },
  });

  if (!songsNew || !songsPopular || !songsLikes || !playlists || !artists)
    return <Loading />;

  return (
    <div className={styles.Home}>
      <Slideshow />

      <SectionOneRow title="Song new" path={paths.SONG + "?sort=newest"}>
        {songsNew &&
          songsNew.map((_, index) => (
            <Card key={index} index={index} data={_} />
          ))}
      </SectionOneRow>

      {/* -- Top -- */}
      <div className={`${styles.Home_top_row} `}>
        <div className={`${styles.Home_top_header}`}>
          <h4>Top Hits</h4>
        </div>
        <div className={`${styles.Home_top_row} row`}>
          <div className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}>
            {songsPopular &&
              songsPopular
                .slice(0, 4)
                .map((_, index) => (
                  <TrackShort key={index} num={index + 1} song={_} />
                ))}
          </div>
          <div className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}>
            {songsPopular &&
              songsPopular
                .slice(4, 8)
                .map((_, index) => (
                  <TrackShort key={index} num={index + 4 + 1} song={_} />
                ))}
          </div>
          <div className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}>
            {songsPopular &&
              songsPopular
                .slice(8, 12)
                .map((_, index) => (
                  <TrackShort key={index} num={index + 8 + 1} song={_} />
                ))}
          </div>
        </div>
      </div>

      <SectionOneRow title="Song popular" path={paths.SONG + "?sort=mostLikes"}>
        {songsLikes &&
          songsLikes.map((_, index) => (
            <Card key={index} index={index} data={_} />
          ))}
      </SectionOneRow>

      <SectionOneRow title="Playlists popular" path={paths.PLAYLIST}>
        {playlists &&
          playlists.map((_, index) => (
            <Card key={index} index={index} data={_} />
          ))}
      </SectionOneRow>

      <SectionOneRow title="Artist" path={paths.PLAYLIST}>
        {artists &&
          artists.map((_, index) => (
            <CardArtist key={index} index={index} artist={_} />
          ))}
      </SectionOneRow>
    </div>
  );
};

export default Home;
