"use client";
import { Section } from "@/components/Section";
import styles from "./style.module.scss";
import { CardRoom } from "@/components/Card";
import { rooms } from "@/lib/data";

const Room = () => {
  return (
    <div className={`${styles.RoomPage}`}>
      <div className={`${styles.RoomPage_header}`}>{/* <h2>Room</h2> */}</div>
      <div className={`${styles.RoomPage_body}`}>
        <Section>
          {Array.from({ length: 10 }).map((_, index) => (
            <CardRoom id={index + 1} key={index} room={rooms[0]} />
          ))}
        </Section>
      </div>
    </div>
  );
};

export default Room;
