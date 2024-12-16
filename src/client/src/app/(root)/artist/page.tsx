"use client";

import { CardArtist } from "@/components/Card";
import { Section } from "@/components/Section";
import { artists } from "@/lib/data";
import React, { useEffect } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";

const Artist = () => {
  const [isLoad, setIsLoad] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoad(false);
    }, 3000);
  }, []);

  return (
    <div className={`${styles.ArtistPage}`}>
      <div className={`${styles.ArtistPage_header}`}>
        <h1>Artist</h1>
      </div>
      <div className={`${styles.ArtistPage_content}`}>
        <div className={`${styles.ArtistPage_content_header}`}></div>
        <div className={`${styles.ArtistPage_content_body}`}>
          {isLoad ? (
            <Loading />
          ) : (
            <Section>
              {artists.map((_, index) => (
                <CardArtist key={index} index={index} artist={_} />
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artist;
