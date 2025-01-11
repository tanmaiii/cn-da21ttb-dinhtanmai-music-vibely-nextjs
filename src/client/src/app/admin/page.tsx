"use client";
import BarChart from "@/components/chart/BarChart";
import LineChart from "@/components/chart/LineChart";
import { Track } from "@/components/Track";
import songService from "@/services/song.service";
import { useQuery } from "@tanstack/react-query";
import styles from "./admin.module.scss";
import playlistService from "@/services/playlist.service";
import roomService from "@/services/room.service";
import userService from "@/services/user.service";
import { formatNumber } from "@/lib/utils";
import adminService from "@/services/admin.service";

const Page = () => {
  const { data: songs } = useQuery({
    queryKey: ["song", "newest"],
    queryFn: async () => {
      const res = await songService.getAllSong({ page: 1, sort: "newest" });
      return res.data;
    },
  });

  const { data: playlists } = useQuery({
    queryKey: ["playlists", "newest"],
    queryFn: async () => {
      const res = await playlistService.getAll({ page: 1, sort: "newest" });
      return res.data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ["rooms", "newest"],
    queryFn: async () => {
      const res = await roomService.getAll({ page: 1, sort: "newest" });
      return res.data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users", "newest"],
    queryFn: async () => {
      const res = await userService.getAllUsers({ page: 1, sort: "newest" });
      return res.data;
    },
  });

  const { data: plays } = useQuery({
    queryKey: ["plays"],
    queryFn: async () => {
      const res = await adminService.getPlaying();
      return res.data;
    },
  });

  const { data: createSong } = useQuery({
    queryKey: ["create-song"],
    queryFn: async () => {
      const res = await adminService.getCreateSong();
      return res.data;
    },
  });

  const { data: genreNumbers } = useQuery({
    queryKey: ["genre"],
    queryFn: async () => {
      const res = await adminService.getGenre();
      return res.data;
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
              <h2>{formatNumber(users?.totalItems || 0)}</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className=" fa-thin fa-music"></i>
              <h4>Songs</h4>
              <h2>{formatNumber(songs?.totalItems || 0)}</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-album"></i>
              <h4>Playlists</h4>
              <h2>{formatNumber(playlists?.totalItems || 0)}</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-signal-stream"></i>
              <h4>Room</h4>
              <h2>{formatNumber(rooms?.totalItems || 0)}</h2>
            </div>
          </div>
        </div>

        <div className={`${styles.chars} row`}>
          <div className={`col pc-7 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>
                Genre distribution of songs
              </h5>
              {genreNumbers && <BarChart genre={genreNumbers} />}
            </div>
          </div>
          <div className={`col pc-5 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>
                Listens and created songs
              </h5>
              {plays && createSong && (
                <LineChart listens={plays} songs={createSong} />
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className={`col pc-12 m-12`}>
            <div className={styles.char_card}>
              <h5 className={styles.title}>Newest songs</h5>
              {songs &&
                songs.data
                  .slice(0, 4)
                  .map((_, index) => <Track key={index} song={_} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
