"use client";
import { CardRoom } from "@/components/Card";
import { Section } from "@/components/Section";
import SliderNav from "@/components/SliderNav";
import { ButtonIcon } from "@/components/ui";
import roomSerive from "@/services/room.service";
import { ISort } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Phổ biến", value: "mostListens" },
  { id: 2, name: "Mới nhất", value: "newest" },
  { id: 3, name: "Cũ nhất", value: "oldest" },
];

const Room = () => {
  const [active, setActive] = useState<ISort>("mostListens");
  const queryClient = useQueryClient();

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
          <ButtonIcon
            dataTooltip="Create playlist"
            icon={<i className="fa-solid fa-plus"></i>}
          />
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
                <CardRoom id={index + 1} key={index} room={_} />
              ))}
          </Section>
        </div>
      )}
    </div>
  );
};

export default Room;
