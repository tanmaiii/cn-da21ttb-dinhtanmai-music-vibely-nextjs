"use client";
import { MotionDiv } from "@/components/Motion";
import { useUI } from "@/context/UIContext";
import React from "react";
import { SkeletonTheme } from "react-loading-skeleton";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const LoadingTheme = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { theme } = useUI();
  return (
    <SkeletonTheme
      baseColor={theme == "dark" ? "#0D1117" : "#ebebeb"}
      highlightColor={theme == "dark" ? "#151B23" : "#f5f5f5"}
      duration={2}
    >
      <MotionDiv
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          ease: "easeInOut",
          duration: 0.2,
        }}
        viewport={{ amount: 0 }}
      >
        {children}
      </MotionDiv>
    </SkeletonTheme>
  );
};

export { LoadingTheme };
