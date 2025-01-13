"use client"; // eslint-disable-line

import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import styles from "../style.module.scss";
import LoadMore from "@/app/(root)/playlist/LoadMore";
import { useState } from "react";
import playlistService from "@/services/playlist.service";
import Empty from "@/components/common/Empty";

const PageSearchPlaylist = () => {
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");
  const [nextPage, setNextPage] = useState(2);

  const { data } = useQuery({
    queryKey: ["search-playlist", searchTerm, 4],
    queryFn: async () => {
      const res = await playlistService.getAll({
        page: 1,
        limit: 4,
        keyword: searchTerm,
        sort: "mostLikes",
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
                sort: "mostLikes",
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

export default PageSearchPlaylist;
