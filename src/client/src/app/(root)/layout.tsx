"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { PlayingBar } from "@/components/Playing";
import ModalLyrics from "@/components/Playing/ModalLyrics";
import { Waiting } from "@/components/Waiting";
import { useUI } from "@/context/UIContext";
import { sidebarLinks } from "@/lib/constants";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./root.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import SongMenu from "@/components/Menu/SongMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLyricsOpen, isPlayingBar } = useUI();
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const router = useRouter();

  useEffect(() => {
    const body = document.querySelector(".RootLayout_main");
    if (body) body.scrollTo(0, 0);
  }, [router.prefetch]);

  return (
    <main className={`row no-gutters ${styles.RootLayout}`}>
      <div
        className={`row no-gutters ${styles.RootLayout_top} ${
          isPlayingBar ? styles.RootLayout_top_playingBarOpen : null
        }`}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        <div className={`${styles.RootLayout_top_sidebar}`}>
          <Sidebar links={sidebarLinks} />
        </div>
        {/* ------------------------------------------- */}
        {/* Main Wrapper */}
        {/* ------------------------------------------- */}
        <div className={` ${styles.RootLayout_top_main}`}>
          <div
            className={`RootLayout_main ${styles.RootLayout_top_main_content}`}
          >
            {/* ------------------------------------------- */}
            {/* Header */}
            {/* ------------------------------------------- */}
            <Header />
            {/* ------------------------------------------- */}
            {/* PageContent */}
            {/* ------------------------------------------- */}
            <div className={` ${styles.RootLayout_top_main_content_body}`}>
              <div
                className={` ${styles.RootLayout_top_main_content_body_list}`}
              >
                {children}
              </div>
              <Footer />
            </div>
            {/* ------------------------------------------- */}
            {/* EndPage */}
            {/* ------------------------------------------- */}
          </div>
          {/* ------------------------------------------- */}
          {/* Waiting */}
          {/* ------------------------------------------- */}
          <div className={`${styles.RootLayout_top_main_waiting}`}>
            <Waiting />
          </div>
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* PlayingBar */}
      {/* ------------------------------------------- */}
      {isPlayingBar && (
        <div className={`row no-gutters ${styles.RootLayout_bottom}`}>
          <PlayingBar />
        </div>
      )}

      {isLyricsOpen && <ModalLyrics />}
      {menuSong && <SongMenu/>}
    </main>
  );
}
