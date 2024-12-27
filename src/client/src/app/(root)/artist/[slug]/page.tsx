"use client";

import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { Card, CardArtist } from "@/components/Card";
import { HeaderPageArtist } from "@/components/HeaderPage";
import { SectionOneRow } from "@/components/Section";
import { TrackShort } from "@/components/Track";
import { paths } from "@/lib/constants";
import { artists, playlists, songs } from "@/lib/data";
import React, { useEffect } from "react";
import Loading from "./loading";
import styles from "./style.module.scss";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import artistService from "@/services/artist.service";

const ArtistPage = () => {
  const [isLoad, setIsLoad] = React.useState(true);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { data, isLoading } = useQuery({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const res = await artistService.getBySlug(slug);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className={`${styles.ArtistPage}`}>
      <div className={`${styles.ArtistPage_header}`}>
        {data && <HeaderPageArtist artist={data} />}
      </div>
      <div className={`${styles.ArtistPage_content}`}>
        <div className={`${styles.ArtistPage_content_header}`}>
          <ButtonIconPrimary
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
          />
          <ButtonIcon
            size="large"
            icon={<i className="fa-solid fa-heart"></i>}
          />
          <ButtonIcon
            size="large"
            icon={<i className="fa-solid fa-ellipsis"></i>}
          />
        </div>
        <div className={`${styles.ArtistPage_content_body} `}>
          <div className={`${styles.ArtistPage_content_body_header} `}>
            <h2>Top Songs By Sơn Tùng MTP</h2>
          </div>
          <div className={`${styles.ArtistPage_content_body_list} row`}>
            <div className={`col pc-4 t-6 m-12`}>
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} song={_} />
              ))}
            </div>
            <div className={` col pc-4 t-6 m-12`}>
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} song={_} />
              ))}
            </div>
            <div className={` col pc-4 t-0 m-12`}>
              {songs.slice(0, 4).map((_, index) => (
                <TrackShort key={index} song={_} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionOneRow title="Songs" path={paths.PLAYLIST}>
            {songs.map((song, index) => (
              <Card key={index} data={song} />
            ))}
          </SectionOneRow>
        </div>

        <div>
          <SectionOneRow title="Playlists" path={paths.PLAYLIST}>
            {playlists.map((playlist, index) => (
              <Card key={index} data={playlist} />
            ))}
          </SectionOneRow>
        </div>

        <div>
          <SectionOneRow title="Artist" path={paths.PAYLIST}>
            {artists.map((artist, index) => (
              <CardArtist key={index} artist={artist} />
            ))}
          </SectionOneRow>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
