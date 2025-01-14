// import styles from "./style.module.scss";

import { LoadingTheme } from "@/components/common/Loading";
import HeaderPageSkeleton from "@/components/HeaderPage/Skeleton";
import { TrackArtist } from "@/components/Track";
import TrackSkeleton from "@/components/Track/Skeleton";
import Skeleton from "react-loading-skeleton";

const loading = () => {
  return (
    <LoadingTheme>
      <div style={{ padding: "0 24px" }}>
        <HeaderPageSkeleton />
        <div style={{ padding: "0 24px", marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <Skeleton inline height={54} width={54} circle />
            <Skeleton inline height={54} width={54} circle />
            <Skeleton inline height={54} width={54} circle />
          </div>
          <Skeleton height={60} width={"100%"} />
          <div className="row" style={{ marginTop: "12px" }}>
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div key={index} className="col pc-3">
                  <TrackSkeleton key={index} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LoadingTheme>
  );
};

export default loading;
