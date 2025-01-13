"use client";

import { Card, CardArtist } from "@/components/Card";
import { HeaderPageArtist } from "@/components/HeaderPage";
import { SectionOneRow } from "@/components/Section";
import { TrackShort } from "@/components/Track";
import { ButtonIcon, ButtonIconPrimary } from "@/components/ui/Button";
import { paths } from "@/lib/constants";
import { artists, playlists } from "@/lib/data";
import artistService from "@/services/artist.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useParams, useRouter } from "next/navigation";
import Loading from "./loading";
import styles from "./style.module.scss";
import { usePlayer } from "@/context/PlayerContext";
import { useCustomToast } from "@/hooks/useToast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Empty from "@/components/common/Empty";

const ArtistPage = () => {
  // const [isLoad, setIsLoad] = React.useState(true);
  const { toastError } = useCustomToast();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { playPlaylist } = usePlayer();
  const currentUser = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: artist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const res = await artistService.getBySlug(slug);
      return res.data;
    },
  });

  const { data: isFollow } = useQuery({
    queryKey: ["artist-follow", artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.checkFollow(artist?.id);
      return res.data;
    },
  });

  const { data: songs } = useQuery({
    queryKey: ["artist-songs-new", artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.getSongs(artist?.id, {
        page: 1,
        limit: 12,
        sort: "newest",
      });
      return res.data.data;
    },
  });

  const { data: songsPopular } = useQuery({
    queryKey: ["artist-songs-popular", artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.getSongs(artist?.id, {
        page: 1,
        limit: 12,
        sort: "mostListens",
      });
      return res.data.data;
    },
  });

  const { data: playlists } = useQuery({
    queryKey: ["artist-playlists", artist],
    queryFn: async () => {
      if (!artist) return;
      const res = await artistService.getPlaylists(artist?.id, {
        page: 1,
        limit: 12,
        sort: "newest",
      });
      return res.data.data;
    },
  });

  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await artistService.getAll({
        page: 1,
        limit: 10,
        sort: "mostLikes",
      });
      return res.data.data;
    },
  });

  const handlePlay = () => {
    console.log("play");
    if (songs && songs?.length > 0 && artist) {
      playPlaylist(songs);
    } else {
      toastError("No songs to play");
    }
  };

  const mutationFollow = useMutation({
    mutationFn: async (isFollow: boolean) => {
      if (!artist) return;
      if (isFollow) {
        const res = await artistService.unFollow(artist.id);
        return res.data;
      } else {
        const res = await artistService.follow(artist.id);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-follow", artist] });
      queryClient.invalidateQueries({ queryKey: ["artist", artist?.slug] });
    },
  });

  if (isLoading) return <Loading />;

  if (error) return notFound();

  return (
    <div className={`${styles.ArtistPage}`}>
      <div className={`${styles.ArtistPage_header}`}>
        {artist && <HeaderPageArtist artist={artist} />}
      </div>
      <div className={`${styles.ArtistPage_content}`}>
        <div className={`${styles.ArtistPage_content_header}`}>
          <ButtonIconPrimary
            onClick={handlePlay}
            size="large"
            icon={<i className="fa-solid fa-play"></i>}
          />

          {currentUser && currentUser.id !== artist?.id ? (
            <button
              onClick={() => mutationFollow.mutate(isFollow || false)}
              className={styles.btn_follow}
            >
              {isFollow ? (
                <>
                  <span className={styles.btn_folowing}>Following</span>
                  <span className={styles.btn_folowing}>Unfollow</span>
                </>
              ) : (
                <span>Follow</span>
              )}
            </button>
          ) : (
            <ButtonIcon
              onClick={() => router.push(paths.SETTINGS)}
              size="medium"
              icon={<i className="fa-light fa-pen"></i>}
            />
          )}
        </div>
        <div className={`${styles.ArtistPage_content_body} `}>
          {songsPopular?.length === 0 &&
            songs?.length === 0 &&
            playlists?.length === 0 && <Empty />}

          {songs && songs?.length > 0 && (
            <div>
              <div className={`${styles.ArtistPage_content_body_header} `}>
                <h2>Top Songs By Sơn Tùng MTP</h2>
              </div>

              <div className={`${styles.ArtistPage_content_body_list} row`}>
                <div className={`col pc-4 t-6 m-12`}>
                  {songs &&
                    songs
                      .slice(0, 2)
                      .map((_, index) => <TrackShort key={index} song={_} />)}
                </div>
                <div className={` col pc-4 t-6 m-12`}>
                  {songs &&
                    songs
                      .slice(2, 4)
                      .map((_, index) => <TrackShort key={index} song={_} />)}
                </div>
                <div className={` col pc-4 t-0 m-12`}>
                  {songs &&
                    songs
                      .slice(4, 6)
                      .map((_, index) => <TrackShort key={index} song={_} />)}
                </div>
              </div>
            </div>
          )}

          {songsPopular && songsPopular.length > 0 && artist && (
            <SectionOneRow
              title="Songs popular"
              path={paths.ARTIST + "/" + artist.slug + paths.SONG}
            >
              {songsPopular.map((song, index) => (
                <Card key={index} data={song} />
              ))}
            </SectionOneRow>
          )}

          {playlists && playlists.length > 0 && artist && (
            <SectionOneRow
              title="Playlists"
              path={paths.ARTIST + "/" + artist.slug + paths.PLAYLIST}
            >
              {playlists.map((playlist, index) => (
                <Card key={index} data={playlist} />
              ))}
            </SectionOneRow>
          )}

          {artists && (
            <SectionOneRow title="Recommend artist" path={paths.ARTIST}>
              {artists.map((_, index) => {
                if (artist && artist.id !== _.id)
                  return <CardArtist key={index} artist={_} />;
              })}
            </SectionOneRow>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
