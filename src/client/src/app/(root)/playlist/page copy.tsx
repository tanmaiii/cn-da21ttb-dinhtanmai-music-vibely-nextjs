"use client";
import { ButtonIcon } from "@/components/ui/Button";
import LoadMore from "@/components/LoadMore";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { fetchData } from "@/lib/api";
import React, { useEffect } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const PlaylistPage = () => {
  const [data, setData] = React.useState(null);
  const [isLoad, setIsLoad] = React.useState(true);
  const [active, setActive] = React.useState("All");

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData(1);
      setData(result);
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
            {data}
            <LoadMore fetch={fetchData} />
          </Section>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;

