import { Card } from "@/components/Card";
import { SectionOneRow } from "@/components/Section";
import { Track, TrackShort } from "@/components/Track";
import styles from "./style.module.scss";
import { songs } from "@/lib/data";

const TrendingPage = () => {
  return (
    <div className={`${styles.TrendingPage}`}>
      <div className={`${styles.TrendingPage_header}`}>
        <h1>Monthly rankings </h1>
      </div>

      <div className={`${styles.TrendingPage_body}`}>
        <div className={`${styles.TrendingPage_body_row} row`}>
          {songs.map((song, index) => (
            <Track primary key={index} num={index + 1} song={song} />
          ))}
        </div>
      </div>

      <div className={`${styles.TrendingPage_section}`}>
        <div className={`${styles.TrendingPage_header}`}>
          <h1>Monthly rankings </h1>
        </div>
        <div className={`${styles.TrendingPage_body} `}>
          <div className={`${styles.TrendingPage_body_row} row`}>
            <div
              className={`${styles.TrendingPage_body_row_col} col pc-4 t-6 m-12`}
            >
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} num={index + 1} song={_} />
              ))}
            </div>
            <div
              className={`${styles.TrendingPage_body_row_col} col pc-4 t-6 m-12`}
            >
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} num={index + 1} song={_} />
              ))}
            </div>
            <div
              className={`${styles.TrendingPage_body_row_col} col pc-4 t-0 m-12`}
            >
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} num={index + 1} song={_} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionOneRow title="Weekly rankings">
        {songs.map((song, index) => (
          <Card key={index} index={index} data={song} />
        ))}
      </SectionOneRow>
    </div>
  );
};

export default TrendingPage;
