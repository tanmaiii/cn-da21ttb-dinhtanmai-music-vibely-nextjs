"use client";

import {
  fadeIn
} from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import { MotionDiv } from "../Motion";
import styles from "./style.module.scss";

const TrackSkeleton = () => {
  return (
    <MotionDiv
      variants={fadeIn({ direction: "up", delay: 0.2 })}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: true }}
      className={`${styles.Track}`}
    >
      <div className={`${styles.Track_swapper} row no-gutters`}>
        <div className={`${styles.Track_swapper_col1} pc-6 t-6 m-8`}>
          <div className={`${styles.Track_swapper_col1_num}`}>
            <h4>
              <Skeleton width={20} />
            </h4>
            <div className={`${styles.line}`}></div>
          </div>
          <div className={`${styles.Track_swapper_col1_image}`}>
            <Skeleton height={60} width={60} />
          </div>
          <div className={`${styles.Track_swapper_col1_desc}`}>
            <h4>
              <Skeleton width={"40%"} />
            </h4>
            <Skeleton width={"70%"} height={20} />
          </div>
        </div>
        <div className={`${styles.Track_swapper_col2} pc-2 t-2 m-0`}>
          <span>
            <Skeleton width={50} />
          </span>
        </div>
        <div className={`${styles.Track_swapper_col3} pc-2 t-2 m-0`}>
          <span>
            <Skeleton width={60} />
          </span>
        </div>
        <div className={`${styles.Track_swapper_col4} pc-2 t-2 m-4`}></div>
      </div>
    </MotionDiv>
  );
};

export default TrackSkeleton;
