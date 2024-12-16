"use client";
import { Card, CardArtist } from "@/components/Card";
import { SectionOneRow } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { TrackShort } from "@/components/Track";
import { artists, songs } from "@/lib/data";
import Image from "next/image";
import React from "react";
import styles from "./style.module.scss";

const listNav = [
  { id: 1, name: "All", value: "All" },
  { id: 2, name: "Artist", value: "Artist" },
  { id: 3, name: "Song", value: "Song" },
  { id: 3, name: "Song", value: "Song2" },
];

const SearchPage = () => {
  const [active, setActive] = React.useState("All");

  return (
    <div className={`${styles.SearchPage}`}>
      <div className={`${styles.SearchPage_header}`}>
        <SliderNav active={active} listNav={listNav} setActive={setActive} />
      </div>

      <div className={`${styles.top} `}>
        <div className="row">
          <div className={`${styles.left} col m-12 t-3 pc-4`}>
            <h4 className={`${styles.top_header}`}>Kết quả hàng đầu</h4>
            <div className={`${styles.card}`}>
              <div className={`${styles.card_image}`}>
                <Image
                  src={"https://picsum.photos/300/300"}
                  alt={"image"}
                  width={150}
                  height={150}
                />
              </div>
              <div className={`${styles.card_desc}`}>
                <h4>Đây là tên bài hát</h4>
                <span>Ca sĩ 1</span>
              </div>
            </div>
          </div>
          <div className={`${styles.right} col m-12 t-9 pc-8`}>
            <h4 className={`${styles.top_header}`}>Songs</h4>
            <div>
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} song={_} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionOneRow title="Songs">
        {songs.map((item, index) => (
          <Card key={index} index={index} data={item} />
        ))}
      </SectionOneRow>

      <SectionOneRow title="Songs">
        {artists.map((item, index) => (
          <CardArtist key={index} index={index} artist={item} />
        ))}
      </SectionOneRow>
    </div>
  );
};

export default SearchPage;
