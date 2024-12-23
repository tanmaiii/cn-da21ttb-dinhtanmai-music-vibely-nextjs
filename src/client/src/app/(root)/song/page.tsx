"use client";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import songService from "@/services/song.service";
import { ISong, ISort, QueryParams } from "@/types";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import LoadMoreSong from "@/components/LoadMore/LoadMoreSong";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "All", value: "newest" },
  { id: 2, name: "Cũ nhất", value: "oldest" },
  { id: 3, name: "Yêu thích", value: "mostLikes" },
  { id: 4, name: "Phổ biến", value: "mostListens" },
];

const SongPage = () => {
  const [data, setData] = useState<ISong[] | null>(null);
  const [active, setActive] = useState<ISort>("newest");
  const [isLoad, setIsLoad] = useState(true);
  const [nextPage, setNextPage] = useState(2);

  useEffect(() => {
    setIsLoad(true);
    const fetchDataAsync = async () => {
      const res = await songService.getAllSong({ page: 1, sort: active });
      setData(res.data.data);
    };

    fetchDataAsync();
    setNextPage(2);
    setTimeout(() => {
      setIsLoad(false);
    }, 2000);
  }, [active]);

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
            listNav={DataSort}
            setActive={(value: ISort) => setActive(value)}
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
            <LoadMoreSong
              setNextPage={setNextPage}
              params={{ sort: active, page: nextPage }}
            />
          </Section>
        </div>
      )}
    </div>
  );
};

export default SongPage;
