"use client";
import songService from "@/services/song.service";
import styles from "./admin.module.scss";
import { TrackShort } from "@/components/Track";
import { useQuery } from "@tanstack/react-query";
import LineChart from "@/components/chart/LineChart";
import BarChart from "@/components/chart/BarChart";

const Page = () => {
  const { data: songs } = useQuery({
    queryKey: ["song", "newest"],
    queryFn: async () => {
      const res = await songService.getAllSong({ page: 1, sort: "newest" });
      return res.data.data;
    },
  });

  return (
    <div className={styles.Admin}>
      <div className={styles.Admin_swapper}>
        <div className={`${styles.top} row`}>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-users"></i>
              <h4>Employees</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className=" fa-thin fa-music"></i>
              <h4>Songs</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-album"></i>
              <h4>Playlists</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-signal-stream"></i>
              <h4>Room</h4>
              <h2>152</h2>
            </div>
          </div>
        </div>

        <div className={`${styles.chars} row`}>
          <div className={`col pc-7 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>Newest songs</h5>
              <BarChart />
            </div>
          </div>
          <div className={`col pc-5 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>Revenue</h5>
              <LineChart />
            </div>
          </div>
        </div>

        <div className="row">
          <div className={`col pc-12 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>Newest songs</h5>
              {songs &&
                songs
                  .slice(0, 4)
                  .map((_, index) => <TrackShort key={index} song={_} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
