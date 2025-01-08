import { Card, CardArtist } from "@/components/Card";
import { SectionOneRow } from "@/components/Section";
import Slideshow from "@/components/Slideshow";
import { TrackShort } from "@/components/Track";
import { paths } from "@/lib/constants";
import { artists, playlists, songs } from "@/lib/data";
import styles from "./root.module.scss";

const Home = () => {

  // return <Loading/>

  return (
    <div className={styles.Home}>
      <Slideshow />

      <SectionOneRow title="Song popular" path={paths.SONG}>
        {songs.map((_, index) => (
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
            {songs.slice(0, 4).map((_, index) => (
              <TrackShort key={index} num={index + 1} song={_} />
            ))}
          </div>
          <div className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}>
            {songs.slice(4, 8).map((_, index) => (
              <TrackShort key={index} num={index + 4 + 1} song={_} />
            ))}
          </div>
          <div className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}>
            {songs.slice(8, 12).map((_, index) => (
              <TrackShort key={index} num={index + 8 + 1} song={_} />
            ))}
          </div>
        </div>
      </div>

      <SectionOneRow title="Song popular" path={paths.SONG}>
        {songs.map((_, index) => (
          <Card key={index} index={index} data={_} />
        ))}
      </SectionOneRow>

      <SectionOneRow title="Playlists popular" path={paths.PLAYLIST}>
        {playlists.map((_, index) => (
          <Card key={index} index={index} data={_} />
        ))}
      </SectionOneRow>

      <SectionOneRow title="Artist" path={paths.PLAYLIST}>
        {artists.map((_, index) => (
          <CardArtist key={index} index={index} artist={_} />
        ))}
      </SectionOneRow>
    </div>
  );
};

export default Home;
