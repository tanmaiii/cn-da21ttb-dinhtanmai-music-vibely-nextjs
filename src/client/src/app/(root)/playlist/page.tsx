"use client";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import playlistService from "@/services/playlist.service";
import { IPlaylist } from "@/types";
import React, { useEffect } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import LoadMorePlaylist from "@/components/LoadMore/LoadMorePlaylist";

const PlaylistPage = () => {
  const [data, setData] = React.useState<IPlaylist[] | null>(null);
  // const [page, setPage] = React.useState(1);
  // const [totalPage, setTotalPage] = React.useState(1);
  const [isLoad, setIsLoad] = React.useState(true);
  const [active, setActive] = React.useState("All");

  useEffect(() => {
    const fetchDataAsync = async () => {
      const res = await playlistService.getAll({ page: 1 });
      setData(res.data.data);
    };

    fetchDataAsync();

    setTimeout(() => {
      setIsLoad(false);
    }, 3000);
  }, []);

  return (
    <div className={`${styles.PlaylistPage}`}>
      <div className={`${styles.PlaylistPage_top}`}>
        <div className={styles.header}>
          <h1>Playlist</h1>
          <ButtonIcon
            dataTooltip="Create playlist"
            icon={<i className="fa-solid fa-plus"></i>}
          />
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={[
              { id: 1, name: "All", value: "All" },
              { id: 2, name: "Artist", value: "Artist" },
              { id: 3, name: "Song", value: "Song" },
            ]}
            setActive={setActive}
          />
        </div>
      </div>
      {isLoad || !data ? (
        <Loading />
      ) : (
        <div className={`${styles.PlaylistPage_body} row no-gutters`}>
          <Section>
            {data.map((item: IPlaylist, index: number) => (
              <Card key={index} data={item} />
            ))}
            <LoadMorePlaylist />
          </Section>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
