"use client";
import { Card } from "@/components/Card";
import LoadMorePlaylist from "@/components/LoadMore/LoadMorePlaylist";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import playlistService from "@/services/playlist.service";
import { IPlaylist, ISort } from "@/types";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Mới nhất", value: "newest" },
  { id: 2, name: "Cũ nhất", value: "oldest" },
  { id: 3, name: "Phổ biến", value: "mostLikes" },
];

const PlaylistPage = () => {
  const [data, setData] = useState<IPlaylist[] | null>(null);
  const [isLoad, setIsLoad] = useState(true);
  const [active, setActive] = useState<ISort>("mostLikes");
  const [nextPage, setNextPage] = useState(2);

  useEffect(() => {
    setIsLoad(true);
    const fetchDataAsync = async () => {
      const res = await playlistService.getAll({ page: 1, sort: active });
      setData(res.data.data);
    };

    fetchDataAsync();
    setNextPage(2);
    setTimeout(() => {
      setIsLoad(false);
    }, 2000);
  }, [active]);

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
            listNav={DataSort}
            setActive={(value: ISort) => setActive(value)}
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
            <LoadMorePlaylist
              setNextPage={setNextPage}
              params={{ sort: active, page: nextPage }}
            />
          </Section>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
