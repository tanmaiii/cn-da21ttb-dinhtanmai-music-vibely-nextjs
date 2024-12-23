// import styles from "./style.module.scss";

import { LoadingTheme } from "@/components/common/Loading";
import { HeaderPage } from "@/components/HeaderPage";
import { TrackShort } from "@/components/Track";
import { exSong } from "@/lib/data";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <HeaderPage data={exSong} isLoading />
      <div style={{ padding: "0 24px", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <Skeleton inline height={54} width={54} circle />
          <Skeleton inline height={54} width={54} circle />
          <Skeleton inline height={54} width={54} circle />
        </div>
        <Skeleton height={60} width={"100%"} />
        <div className="row" style={{ marginTop: "12px" }}>
          <div className={`col pc-4 t-6 m-12`}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TrackShort isLoading key={index} song={exSong} />
            ))}
          </div>
          <div className={`col pc-4 t-6 m-12`}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TrackShort isLoading key={index} song={exSong} />
            ))}
          </div>
          <div className={`col pc-4 t-6 m-12`}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TrackShort isLoading key={index} song={exSong} />
            ))}
          </div>
        </div>
      </div>
    </LoadingTheme>
  );
};

export default loading;
