"use client";
import { CardArtist } from "@/components/Card";
import Empty from "@/components/common/Empty";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { paths } from "@/lib/constants";
import artistService from "@/services/artist.service";
import { IArtist, ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import LoadMore from "./LoadMore";
import styles from "./style.module.scss";

const MyArtistPage = () => {
  const [nextPage, setNextPage] = useState(2);
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["my-artist"] });
  }, [queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-artist"],
    queryFn: async () => {
      const res = await artistService.getArtistFollowers({
        page: 1,
        limit: 2,
      });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  if (isLoading) <Loading />;

  return (
    <div className={`${styles.MyArtistPage}`}>
      <div className={`${styles.MyArtistPage_top}`}>
        <div className={styles.header}>
          <h1>My follow</h1>
        </div>
      </div>
      <div className={`${styles.MyArtistPage_body} row no-gutters`}>
        {data && data?.length > 0 ? (
          <Section>
            {data.map((item: IArtist, index: number) => (
              <CardArtist index={index} key={index} artist={item} />
            ))}
            <LoadMore
              setNextPage={setNextPage}
              params={{ page: nextPage, limit: 2 }}
            />
          </Section>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default MyArtistPage;
