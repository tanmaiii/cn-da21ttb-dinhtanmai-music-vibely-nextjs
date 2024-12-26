"use client";
import { Section } from "@/components/Section";
import styles from "./style.module.scss";
import { CardRoom } from "@/components/Card";
import { useEffect, useState } from "react";
import roomSerive from "@/services/room.service";
import { IRoom, ISort } from "@/types";
import { ButtonIcon } from "@/components/ui";
import SliderNav from "@/components/SliderNav";
import Loading from "./loading";

const DataSort: { id: number; name: string; value: ISort }[] = [
  { id: 1, name: "Phổ biến", value: "mostListens" },
  { id: 2, name: "Mới nhất", value: "newest" },
  { id: 3, name: "Cũ nhất", value: "oldest" },
];

const Room = () => {
  const [data, setData] = useState<IRoom[] | null>(null);
  const [active, setActive] = useState<ISort>("mostListens");
  const [isLoad, setIsLoad] = useState(true);

  const featchData = async () => {
    setIsLoad(true);
    try {
      const res = await roomSerive.getAll({ page: 1, sort: active });
      if (res.data) setData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setIsLoad(false);
    }, 1000);
  };

  useEffect(() => {
    featchData();
  }, [active]);

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
            setActive={(value: ISort) => setActive(value)}
          />
        </div>
      </div>
      {isLoad ? (
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
