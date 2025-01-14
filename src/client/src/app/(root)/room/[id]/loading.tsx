"use client";

import { LoadingTheme } from "@/components/common/Loading";
import TrackSkeleton from "@/components/Track/Skeleton";
import Skeleton from "react-loading-skeleton";
import styles from "./style.module.scss";

const Loading = () => {
  return (
    <LoadingTheme>
      <div className={`${styles.RoomPage} `}>
        <div className="row">
          <div className="col pc-8 t-7 m-12">
            <Skeleton inline height={400} width={"100%"} />
            <div style={{ marginTop: "12px" }}>
              <Skeleton height={60} width={"100%"} />
              <div className="row">
                {Array.from({ length: 4 }).map((_, index) => {
                  return (
                    <div key={index} className="col pc-12 t-12 m-12">
                      <TrackSkeleton />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col pc-4 t-5 m-0">
            <Skeleton inline height={"100%"} width={"100%"} />
          </div>
        </div>
      </div>
    </LoadingTheme>
  );
};

export default Loading;
