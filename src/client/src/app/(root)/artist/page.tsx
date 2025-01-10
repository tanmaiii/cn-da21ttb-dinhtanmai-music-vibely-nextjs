"use client";

import { CardArtist } from "@/components/Card";
import { Section } from "@/components/Section";
// import { artists } from "@/lib/data";
import artistService from "@/services/artist.service";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Loading from "./loading";
import LoadMore from "./LoadMore";
import styles from "./style.module.scss";
import SliderNav from "@/components/SliderNav";
import { ISort } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "@/lib/constants";

const DataSort: { id: number; name: string; value: string }[] = [
  { id: 1, name: "Newest", value: "newest" },
  { id: 2, name: "Oldest", value: "oldest" },
  { id: 3, name: "Popular", value: "mostLikes" },
];

const Artist = () => {
  const [isLoad, setIsLoad] = React.useState(true);
  const [active, setActive] = useState<string>("newest");
  const [nextPage, setNextPage] = useState(2);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    setTimeout(() => {
      setIsLoad(false);
    }, 3000);
  }, []);

  const { data: artists } = useQuery({
    queryKey: ["artist", active],
    queryFn: async () => {
      const res = await artistService.getAll({
        page: 1,
        sort: active as ISort,
        limit: 5,
      });

      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    if (query.sort) {
      setActive(query.sort as string);
    }
  }, [query]);

  const onChangeSort = (value: string) => {
    setActive(value);
    setNextPage(2);
    router.push(paths.ARTIST + `?sort=${value}`);
  };

  return (
    <div className={`${styles.ArtistPage}`}>
      <div className={`${styles.ArtistPage_top}`}>
        <div className={`${styles.ArtistPage_header}`}>
          <h1>Artist</h1>
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={DataSort}
            setActive={(value: string) => onChangeSort(value)}
          />
        </div>
      </div>
      <div className={`${styles.ArtistPage_content}`}>
        <div className={`${styles.ArtistPage_content_header}`}></div>
        <div className={`${styles.ArtistPage_content_body}`}>
          {isLoad ? (
            <Loading />
          ) : (
            <Section>
              {artists &&
                artists.map((_, index) => (
                  <CardArtist key={index} index={index} artist={_} />
                ))}
              <LoadMore
                setNextPage={setNextPage}
                params={{ sort: active as ISort, page: nextPage, limit: 5 }}
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artist;
