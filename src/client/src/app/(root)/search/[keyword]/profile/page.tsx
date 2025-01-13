"use client"; // eslint-disable-line

import { CardArtist } from "@/components/Card";
import { Section } from "@/components/Section";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import styles from "../style.module.scss";
import LoadMoreProfile from "./LoadMoreProfile";
import { useState } from "react";
import Empty from "@/components/common/Empty";
import userService from "@/services/user.service";

const PageSearchProfile = () => {
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");
  const [nextPage, setNextPage] = useState(2);

  const { data } = useQuery({
    queryKey: ["search-profile", searchTerm, 4],
    queryFn: async () => {
      const res = await userService.getAllUsers({
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
              return <CardArtist index={index} key={index} artist={item} />;
            })}
            <LoadMoreProfile
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

export default PageSearchProfile;
