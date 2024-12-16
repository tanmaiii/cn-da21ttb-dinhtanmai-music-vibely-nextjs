"use client";

import Sidebar from "@/components/common/Sidebar";
import React, { useEffect } from "react";
import styles from "./root.module.scss";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { PlayingBar } from "@/components/Playing";
import { Waiting } from "@/components/Waiting";
import ModalLyrics from "@/components/Playing/ModalLyrics";
import { useUI } from "@/context/UIContext";
import { useRouter } from "next/navigation";
import { sidebarLinks } from "@/lib/constants";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLyricsOpen, isPlayingBar } = useUI();
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
        <div className={`${styles.RootLayout_top_sidebar}`}>
          <Sidebar links={sidebarLinks} />
        </div>

        <div className={` ${styles.RootLayout_top_main}`}>
          <div
            className={`RootLayout_main ${styles.RootLayout_top_main_content}`}
          >
            <Header />
            <div className={` ${styles.RootLayout_top_main_content_body}`}>
              <div
                className={` ${styles.RootLayout_top_main_content_body_list}`}
              >
                {children}
              </div>
              <Footer />
            </div>
          </div>
          <div className={`${styles.RootLayout_top_main_waiting}`}>
            <Waiting />
          </div>
        </div>
      </div>

      {isPlayingBar && (
        <div className={`row no-gutters ${styles.RootLayout_bottom}`}>
          <PlayingBar />
        </div>
      )}

      {isLyricsOpen && <ModalLyrics />}
    </main>
  );
}
