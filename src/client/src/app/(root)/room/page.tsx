"use client";

import { CardRoom } from "@/components/Card";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui";
import { paths, PERMISSIONS } from "@/lib/constants";
import roomSerive from "@/services/room.service";
import { ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import { hasPermission } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Popular", value: "mostListens" },
  { id: 2, name: "Newest", value: "newest" },
  { id: 3, name: "Oldest", value: "oldest" },
];

const Room = () => {
  const [active, setActive] = useState<ISort>("mostListens");
  const currentUser = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["room", active],
    queryFn: async () => {
      const res = await roomSerive.getAll({ page: 1, sort: active });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["playlist"] });
  }, [active, queryClient]);

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
              dataTooltip="Create playlist"
              onClick={() => router.push(`${paths.ROOM}/create`)}
              icon={<i className="fa-solid fa-plus"></i>}
            />
          )}
        </div>
        <div className={styles.slider}>
          <SliderNav
            active={active}
            listNav={DataSort}
            setActive={(value: string) => setActive(value as ISort)}
          />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.RoomPage_body}`}>
          <Section>
            {data &&
              data.map((_, index) => (
                <CardRoom index={index + 1} key={index} room={_} />
              ))}
          </Section>
        </div>
      )}
    </div>
  );
};

export default Room;
