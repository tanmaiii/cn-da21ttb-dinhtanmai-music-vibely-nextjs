"use client"; // eslint-disable-line

import LoadMore from "@/app/(root)/room/LoadMore";
import { CardRoom } from "@/components/Card";
import Empty from "@/components/common/Empty";
import { Section } from "@/components/Section";
import roomService from "@/services/room.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import styles from "../style.module.scss";

const PageSearchRoom = () => {
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");
  const [nextPage, setNextPage] = useState(2);

  const { data } = useQuery({
    queryKey: ["search-room", searchTerm, 4],
    queryFn: async () => {
      const res = await roomService.getAll({
        page: 1,
        limit: 4,
        keyword: searchTerm,
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
              return <CardRoom index={index} key={index} room={item} />;
            })}
            <LoadMore
              setNextPage={setNextPage}
              params={{
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

export default PageSearchRoom;
