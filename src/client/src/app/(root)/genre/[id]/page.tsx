"use client";
import { Card } from "@/components/Card";
import Empty from "@/components/common/Empty";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { paths } from "@/lib/constants";
import songService from "@/services/song.service";
import { ISong, ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import LoadMore from "./LoadMore";
import styles from "./style.module.scss";
import genreService from "@/services/genre.service";

const DataSort: { id: number; name: string; value: string }[] = [
  { id: 1, name: "Newest", value: "newest" },
  { id: 2, name: "Oldest", value: "oldest" },
  { id: 3, name: "Most Likes", value: "mostLikes" },
  { id: 4, name: "Popular", value: "mostListens" },
];

const GenrePage = () => {
  const [active, setActive] = useState<string>("newest");
  const [nextPage, setNextPage] = useState(2);
  const queryClient = useQueryClient();
  const [isLoad, setIsLoad] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const params = useParams();
  const genreId = decodeURIComponent((params.id as string) || "");

  const { data: genre } = useQuery({
    queryKey: ["genre", genreId],
    queryFn: async () => {
      const res = await genreService.getById(genreId);
      return res.data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["song", active, genreId],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        sort: active as ISort,
        genreId: genreId,
        limit: 2,
      });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["song"] });
  }, [active, queryClient]);

  useEffect(() => {
    if (query.sort) {
      setActive(query.sort as string);
    }
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoad(false);
    }, 2000);
  }, []);

  const onChangeSort = (value: string) => {
    setActive(value);
    router.push(paths.GENRE + "/" + genreId + `?sort=${value}`);
  };

  return (
    <div className={`${styles.GenrePage}`}>
      <div className={`${styles.GenrePage_top}`}>
        <div className={styles.header}>
          <h1>{`Genre - ${genre?.title || ""}`}</h1>
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={DataSort}
            setActive={(value: string) => onChangeSort(value)}
          />
        </div>
      </div>
      {isLoading || isLoad ? (
        <Loading />
      ) : (
        <div className={`${styles.SongPage_body} row no-gutters`}>
          {data && data?.length > 0 ? (
            <Section>
              {data.map((item: ISong, index: number) => (
                <Card index={index} key={index} data={item} />
              ))}
              <LoadMore
                setNextPage={setNextPage}
                params={{
                  sort: active as ISort,
                  page: nextPage,
                  genreId: genreId,
                  limit: 2,
                }}
              />
            </Section>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  );
};

export default GenrePage;
