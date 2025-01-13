"use client"; // eslint-disable-line

import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import songService from "@/services/song.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import styles from "../style.module.scss";
import LoadMore from "@/app/(root)/song/LoadMore";
import { useState } from "react";
import Empty from "@/components/common/Empty";

const PageSearchSong = () => {
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");
  const [nextPage, setNextPage] = useState(2);

  const { data } = useQuery({
    queryKey: ["search-song", searchTerm, 4],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 4,
        keyword: searchTerm,
        sort: "mostListens",
      });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  return (
    <div className={styles.DetailPage}>
      {/* <div>
        <h1 className="text-2xl font-bold mb-4">{`Search for "${searchTerm}"`}</h1>
      </div> */}
      <Section>
        {data && data.length > 0 ? (
          <>
            {data.map((item, index) => {
              return <Card index={index} key={index} data={item} />;
            })}
            <LoadMore
              setNextPage={setNextPage}
              params={{
                sort: "mostListens",
                page: nextPage,
                limit: 4,
                keyword: searchTerm,
              }}
            />
          </>
        ) : (
          <Empty />
        )}
      </Section>
    </div>
  );
};

export default PageSearchSong;
