"use client";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import songService from "@/services/song.service";
import { ISong } from "@/types";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

const SongPage = () => {
  const [data, setData] = useState<ISong[]>([]);
  const [isLoad, setIsLoad] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await songService.getAllSong();
      console.log(data.data);
      setData(data.data);
      setIsLoad(false);
    };
    fetchSongs();
  }, []);

  return (
    <div className={`${styles.SongPage}`}>
      <div className={`${styles.SongPage_top}`}>
        <div className={styles.header}>
          <h1>Song</h1>
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
        <div className={`${styles.SongPage_body} row no-gutters`}>
          <Section>
            {data.map((item, index) => {
              return <Card key={index} data={item} />;
            })}
            {/* <LoadMore fetch={fetchData} /> */}
          </Section>
        </div>
      )}
    </div>
  );
};

export default SongPage;
