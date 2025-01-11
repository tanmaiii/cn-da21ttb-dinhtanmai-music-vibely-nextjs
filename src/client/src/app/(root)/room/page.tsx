"use client";

import { CardRoom } from "@/components/Card";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui";
import { paths, PERMISSIONS } from "@/lib/constants";
import roomService from "@/services/room.service";
import { ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import { hasPermission } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import LoadMoreRoom from "./LoadMore";
import Empty from "@/components/common/Empty";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Popular", value: "mostListens" },
  { id: 2, name: "Newest", value: "newest" },
  { id: 3, name: "Oldest", value: "oldest" },
];

const Room = () => {
  const [active, setActive] = useState<string>("mostListens");
  const [nextPage, setNextPage] = useState(2);
  const currentUser = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useQuery({
    queryKey: ["room", active],
    queryFn: async () => {
      const res = await roomService.getAll({
        page: 1,
        sort: active as ISort,
        limit: 5,
      });
      setNextPage(2);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["playlist"] });
  }, [active, queryClient]);

  useEffect(() => {
    if (query.sort) {
      setActive(query.sort as string);
    }
  }, [query]);

  const onChangeSort = (value: string) => {
    setActive(value as string);
    setNextPage(2);
    router.push(paths.ROOM + `?sort=${value}`);
  };

  return (
    <div className={`${styles.RoomPage}`}>
      <div className={`${styles.RoomPage_top}`}>
        <div className={styles.header}>
          <h1>Room</h1>
          {hasPermission(
            currentUser?.role?.permissions,
            PERMISSIONS.CREATE_ROOM
          ) && (
            <ButtonIcon
              dataTooltip="Create room"
              onClick={() => router.push(`${paths.ROOM}/create`)}
              icon={<i className="fa-solid fa-plus"></i>}
            />
          )}
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={DataSort}
            setActive={(value: string) => onChangeSort(value)}
          />
        </div>
      </div>
      {data && data.length === 0 && <Empty />}
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.RoomPage_body}`}>
          <Section>
            {data &&
              data.map((_, index) => (
                <CardRoom index={index + 1} key={index} room={_} />
              ))}
            <LoadMoreRoom
              setNextPage={setNextPage}
              params={{ sort: active as ISort, page: nextPage, limit: 5 }}
            />
          </Section>
        </div>
      )}
    </div>
  );
};

export default Room;
