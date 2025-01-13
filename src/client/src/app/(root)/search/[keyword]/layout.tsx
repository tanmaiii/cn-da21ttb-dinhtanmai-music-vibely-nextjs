"use client";

import SliderNav from "@/components/SliderNav";
import React from "react";
import styles from "./style.module.scss";
import { useParams, useRouter } from "next/navigation";

const listNav = [
  { id: 1, name: "All", value: "" },
  { id: 2, name: "Song", value: "song" },
  { id: 3, name: "Playlist", value: "playlist" },
  { id: 3, name: "Room", value: "room" },
  { id: 3, name: "Profile", value: "profile" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = React.useState("");
  const router = useRouter();
  const params = useParams();
  const keyword = Array.isArray(params.keyword) ? params.keyword[0] : params.keyword;

  const handleActive = (value: string) => {
    router.push(`/search/${keyword}/${value}`);
    setActive(value);
  }

  return (
    <div className={`${styles.LayoutSearchPage}`}>
      <div className={styles.LayoutSearchPage_header}>
        <SliderNav active={active} listNav={listNav} setActive={handleActive} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
