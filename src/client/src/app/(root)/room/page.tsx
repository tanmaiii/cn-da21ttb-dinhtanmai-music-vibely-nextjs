"use client";
import React from "react";
import styles from "./style.module.scss";
import { Section } from "@/components/Section";
import { CardRoom } from "@/components/Card";

const Room = () => {
  return (
    <div className={`${styles.RoomPage}`}>
      <div className={`${styles.RoomPage_header}`}>
        <h2>Room</h2>
      </div>
      <div className={`${styles.RoomPage_body}`}>
        <Section>
          {Array.from({ length: 10 }).map((_, index) => (
            <CardRoom
              id={index + 1}
              key={index}
              title={`Title ${index + 1}`}
              author="Author"
              img="https://picsum.photos/200/300"
            />
          ))}
        </Section>
      </div>
    </div>
  );
};

export default Room;
