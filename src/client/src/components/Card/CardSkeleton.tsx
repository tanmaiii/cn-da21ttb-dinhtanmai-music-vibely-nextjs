"use client";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { ButtonIconRound } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { MotionDiv } from "../Motion";
import styles from "./style.module.scss";

const useClassNameCol = () => {
  const [classNameCol, setClassNameCol] = useState("col pc-2 t-4 m-6");
  const { isSidebarOpen, isWaitingOpen } = useUI();

  useEffect(() => {
    if (isWaitingOpen) {
      if (isSidebarOpen) {
        setClassNameCol("col pc-1-7 t-3 m-4");
      } else {
        setClassNameCol("col pc-2 t-3 m-4");
      }
    } else {
      if (isSidebarOpen) {
        setClassNameCol("col pc-1-5 t-3 m-4");
      } else {
        setClassNameCol("col pc-1-7 t-3 m-4");
      }
    }
  }, [isSidebarOpen, isWaitingOpen]);
  return classNameCol;
};

const CardSkeleton = () => {
  const classNameCol = useClassNameCol();

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      viewport={{ amount: 0 }}
      className={`${styles.Card}  ${classNameCol}`}
    >
      <div className={`${styles.Card_swapper}`}>
        <div className={`${styles.Card_swapper_container}`}>
          <div className={`${styles.Card_swapper_container_image}`}>
            <Skeleton height={"100%"} />

            <div className={`${styles.Card_swapper_container_image_buttons}`}>
              <ButtonIconRound
                size="large"
                // icon={}
              />
            </div>
          </div>
          <div className={`${styles.Card_swapper_container_desc}`}>
            <Skeleton width={"90%"} height={20} />
            <Skeleton style={{ marginTop: "6px" }} width={"70%"} height={20} />
            <div style={{ marginTop: "6px" }}>
              <Skeleton
                style={{ marginRight: "12px" }}
                inline
                width={"20%"}
                height={20}
              />
              <Skeleton inline width={"30%"} height={20} />
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default CardSkeleton;
