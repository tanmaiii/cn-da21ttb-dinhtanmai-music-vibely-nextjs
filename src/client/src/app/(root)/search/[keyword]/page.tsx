"use client";
import { Card, CardArtist, CardRoom } from "@/components/Card";
import { SectionOneRow } from "@/components/Section";
import { TrackShort } from "@/components/Track";
import { IMAGES, paths, ROLES } from "@/lib/constants";
import { apiImage } from "@/lib/utils";
import artistService from "@/services/artist.service";
import songService from "@/services/song.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./style.module.scss";
import playlistService from "@/services/playlist.service";
import Empty from "@/components/common/Empty";
import roomService from "@/services/room.service";
import userService from "@/services/user.service";
import { useEffect } from "react";

const SearchPage = () => {
  // const router = useRouter();
  const params = useParams();
  const searchTerm = decodeURIComponent((params.keyword as string) || "");

  const { data: songPopular } = useQuery({
    queryKey: ["search-song", searchTerm],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 10,
        keyword: searchTerm,
        sort: "mostListens",
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: songs } = useQuery({
    queryKey: ["search-song", searchTerm],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: 1,
        limit: 10,
        keyword: searchTerm,
        sort: "newest",
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: artists } = useQuery({
    queryKey: ["search-artist", searchTerm],
    queryFn: async () => {
      const res = await artistService.getAll({
        page: 1,
        limit: 10,
        keyword: searchTerm,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: playlists } = useQuery({
    queryKey: ["search-playlist", searchTerm],
    queryFn: async () => {
      const res = await playlistService.getAll({
        page: 1,
        limit: 10,
        keyword: searchTerm,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: room } = useQuery({
    queryKey: ["search-room", searchTerm],
    queryFn: async () => {
      const res = await roomService.getAll({
        page: 1,
        limit: 10,
        keyword: searchTerm,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  const { data: users } = useQuery({
    queryKey: ["search-users", searchTerm],
    queryFn: async () => {
      const res = await userService.getAllUsers({
        page: 1,
        limit: 10,
        keyword: searchTerm,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được xem là "fresh" trong 5 phút
  });

  useEffect(() => {
    let prev = JSON.parse(localStorage.getItem("search-history") || "[]");
    if (searchTerm) {
      if (!prev.includes(searchTerm)) {
        const existingHistory = JSON.parse(
          localStorage.getItem("search-history") || "[]"
        );
        const newHistory = [searchTerm, ...existingHistory];
        const trimmedHistory = newHistory.slice(0, 5);
        localStorage.setItem("search-history", JSON.stringify(trimmedHistory));
      }
    }
  }, [searchTerm]);

  if (
    songPopular?.length === 0 &&
    songs?.length === 0 &&
    artists?.length === 0 &&
    playlists?.length === 0 &&
    room?.length === 0
  )
    return <Empty />;

  return (
    <div className={`${styles.SearchPage}`}>
      <div className={`${styles.top} `}>
        {songPopular && songPopular.length > 0 && (
          <div className="row">
            <div className={`${styles.left} col m-12 t-3 pc-4`}>
              <h4 className={`${styles.top_header}`}>Top results </h4>
              <Link
                href={paths.SONG + "/" + songPopular[0].slug}
                className={`${styles.card}`}
              >
                <div className={`${styles.card_image}`}>
                  <Image
                    src={
                      songPopular[0]?.imagePath
                        ? apiImage(songPopular[0]?.imagePath)
                        : IMAGES.SONG
                    }
                    alt={"image"}
                    width={150}
                    height={150}
                  />
                </div>
                <div className={`${styles.card_desc}`}>
                  <h4>{songPopular[0].title}</h4>
                  <span>{songPopular[0].creator.name}</span>
                </div>
              </Link>
            </div>
            <div className={`${styles.right} col m-12 t-9 pc-8`}>
              <h4 className={`${styles.top_header}`}>Songs</h4>
              <div>
                {songPopular.length > 1 ? (
                  songPopular
                    .slice(1, 5)
                    .map((_, index) => <TrackShort key={index} song={_} />)
                ) : (
                  <div>No result</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {songs && songs?.length > 0 && (
        <SectionOneRow title="Songs">
          {songs.map((item, index) => (
            <Card key={index} index={index} data={item} />
          ))}
        </SectionOneRow>
      )}

      {playlists && playlists?.length > 0 && (
        <SectionOneRow title="Playlists">
          {playlists.map((item, index) => (
            <Card key={index} index={index} data={item} />
          ))}
        </SectionOneRow>
      )}

      {room && room?.length > 0 && (
        <SectionOneRow title="Room">
          {room.map((item, index) => (
            <CardRoom key={index} index={index} room={item} />
          ))}
        </SectionOneRow>
      )}

      {artists && artists.length > 0 && (
        <SectionOneRow title="Artist">
          {artists.map((item, index) => (
            <CardArtist key={index} index={index} artist={item} />
          ))}
        </SectionOneRow>
      )}

      {users && users.length > 0 && (
        <SectionOneRow title="Profile">
          {users.map((item, index) => {
            return <CardArtist key={index} index={index} artist={item} />;
          })}
        </SectionOneRow>
      )}
    </div>
  );
};

export default SearchPage;
