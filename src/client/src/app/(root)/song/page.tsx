"use client";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui/Button";
import songService from "@/services/song.service";
import { ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loading from "./loading";
import LoadMore from "./LoadMore";
import styles from "./style.module.scss";

const DataSort: { id: number; name: string; value: string }[] = [
  { id: 1, name: "Newest", value: "newest" },
  { id: 2, name: "Oldest", value: "oldest" },
  { id: 3, name: "Most Likes", value: "mostLikes" },
  { id: 4, name: "Popular", value: "mostListens" },
];

const SongPage = () => {
  const [active, setActive] = useState<string>("newest");
  const [nextPage, setNextPage] = useState(2);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["song", active],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        sort: active as ISort,
      });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["song"] });
  }, [active, queryClient]);

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
            setActive={(value: string) => setActive(value)}
          />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.SongPage_body} row no-gutters`}>
          <Section>
            {data &&
              data.map((item, index) => {
                return <Card index={index} key={index} data={item} />;
              })}
            <LoadMore
              setNextPage={setNextPage}
              params={{ sort: active as ISort, page: nextPage }}
            />
          </Section>
        </div>
      )}
    </div>
  );
};

export default SongPage;
