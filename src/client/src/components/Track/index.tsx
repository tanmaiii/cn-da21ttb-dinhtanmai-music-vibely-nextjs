import { IMAGES, paths } from "@/lib/constants";
import {
  apiImage,
  fadeIn,
  formatDateTime,
  formatNumber,
  padNumber,
} from "@/lib/utils";
import { IArtist, ISong } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { ButtonIconRound } from "../ui/Button";
import { MotionDiv } from "../Motion";
import styles from "./style.module.scss";

interface Props {
  num?: number;
  isLoading?: boolean;
}

interface ITrack extends Props {
  primary?: boolean;
  dontShowPlay?: boolean;
  song: ISong;
}

interface ITrackArtist extends Props {
  artist: IArtist;
}

const Track = (props: ITrack) => {
  const { num, primary, isLoading = false, song } = props;
  return (
    <MotionDiv
      variants={fadeIn({ direction: "up", delay: 0.2 })}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: true }}
      aria-disabled={isLoading}
      className={`${styles.Track}`}
    >
      <div
        aria-disabled={isLoading}
        className={`${styles.Track_swapper} row no-gutters`}
      >
        <div className={`${styles.Track_swapper_col1} pc-6 t-6 m-8`}>
          {!isLoading && num && (
            <div
              className={`${styles.Track_swapper_col1_num} ${
                primary ? styles.Track_swapper_col1_num_main : ""
              }`}
            >
              <h4>{isLoading ? <Skeleton width={20} /> : num}</h4>
              <div className={`${styles.line}`}></div>
            </div>
          )}
          <div className={`${styles.Track_swapper_col1_image}`}>
            {isLoading ? (
              <Skeleton height={60} width={60} />
            ) : (
              <Image
                src={song.imagePath ? apiImage(song.imagePath) : IMAGES.SONG}
                alt="image.png"
                width={50}
                height={50}
                quality={90}
              />
            )}

            <button className={`${styles.button_play}`}>
              <i className="fa-solid fa-play"></i>
            </button>
          </div>
          <div className={`${styles.Track_swapper_col1_desc}`}>
            <h4>
              {isLoading ? (
                <Skeleton width={"40%"} />
              ) : (
                <Link href={`${paths.SONG}/${song.slug}`}>{song.title}</Link>
              )}
            </h4>
            {isLoading ? (
              <Skeleton width={"70%"} height={20} />
            ) : (
              <p>
                {/* {song?.owner.map((owner, index) => (
                  <Link key={index} href={`${paths.ARTIST}/${owner?.id || 1}`}>
                    {owner?.name}
                  </Link>
                ))} */}
                <Link href={`${paths.ARTIST}/${song?.creator?.slug || 1}`}>
                  {song?.creator?.name}
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className={`${styles.Track_swapper_col2} pc-2 t-2 m-0`}>
          <span>
            {isLoading ? (
              <Skeleton width={50} />
            ) : (
              formatDateTime(new Date(song.createdAt)).dateOnly
            )}
          </span>
        </div>
        <div className={`${styles.Track_swapper_col3} pc-2 t-2 m-0`}>
          <span>
            {isLoading ? <Skeleton width={60} /> : formatNumber(song.listens)}
          </span>
        </div>
        <div className={`${styles.Track_swapper_col4} pc-2 t-2 m-4`}>
          <div className={`${styles.item_hover}`}>
            <ButtonIconRound icon={<i className="fa-solid fa-heart"></i>} />
          </div>

          <div className={`${styles.item_default}`}>
            <span>
              {isLoading ? <Skeleton width={50} /> : song.duration || 100}
            </span>
          </div>

          <div className={`${styles.item_hover}`}>
            <ButtonIconRound icon={<i className="fa-solid fa-ellipsis"></i>} />
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const TrackShort = (props: ITrack) => {
  const { num, isLoading, song, dontShowPlay = false } = props;

  return (
    <div aria-disabled={isLoading} className={`${styles.TrackShort}`}>
      <div className={`${styles.TrackShort_swapper}`}>
        <div className={`${styles.TrackShort_swapper_left}`}>
          {!isLoading && num && (
            <div className={`${styles.TrackShort_swapper_left_num}`}>
              <h2>{padNumber(num)}</h2>
              <div className={`${styles.line}`}></div>
            </div>
          )}
          <div className={`${styles.TrackShort_swapper_left_image}`}>
            {isLoading || !song ? (
              <Skeleton height={50} width={50} />
            ) : (
              <Image
                src={IMAGES.SONG}
                alt="song"
                quality={90}
                width={50}
                height={50}
              />
            )}
            {!dontShowPlay && (
              <button className={`${styles.button_play}`}>
                <i className="fa-solid fa-play"></i>
              </button>
            )}
          </div>
          <div className={`${styles.TrackShort_swapper_left_desc}`}>
            {isLoading ? (
              <>
                <Skeleton width={"50%"} />
                <Skeleton width={"30%"} />
              </>
            ) : (
              <>
                <h4>
                  <Link href={paths.SONG + song?.slug}>{song?.title}</Link>
                </h4>
                <p>
                  {/* {song?.owner.map((owner, index) => (
                    <Link
                      key={index}
                      href={`${paths.ARTIST}/${owner?.id || 1}`}
                    >
                      {owner.name}
                    </Link>
                  ))} */}
                  <Link href={`${paths.ARTIST}/${song?.creator?.slug || 1}`}>
                    {song?.creator?.name}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
        <div className={`${styles.TrackShort_swapper_right}`}>
          <div className={`${styles.item_hover}`}>
            <ButtonIconRound
              size="small"
              icon={
                <i style={{ color: "red" }} className="fa-solid fa-heart"></i>
              }
            />
            <ButtonIconRound
              size="small"
              icon={<i className="fa-solid fa-ellipsis"></i>}
            />
          </div>
          <div className={`${styles.item_default}`}>
            <span>
              {isLoading ? <Skeleton width={60} /> : formatNumber(song.listens)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackArtist = (props: ITrackArtist) => {
  const { artist, isLoading = false } = props;
  return (
    <div aria-disabled={isLoading} className={`${styles.TrackArtist}`}>
      <div className={`${styles.TrackArtist_swapper}`}>
        <div className={`${styles.TrackArtist_swapper_left}`}>
          <div className={`${styles.TrackArtist_swapper_left_image}`}>
            {isLoading ? (
              <Skeleton height={"100%"} circle />
            ) : (
              <Image
                src={artist?.imagePath ? artist.imagePath : IMAGES.AVATAR}
                alt="song"
                quality={90}
                width={50}
                height={50}
              />
            )}
          </div>
          <div className={`${styles.TrackArtist_swapper_left_desc}`}>
            {isLoading ? <Skeleton width={50} /> : <p>Artist</p>}
            {isLoading ? <Skeleton width={100} /> : <h4>{artist?.name}</h4>}
          </div>
        </div>
        <div className={`${styles.TrackArtist_swapper_right}`}>
          <div className={`${styles.item_hover}`}>
            <ButtonIconRound icon={<i className="fa-solid fa-heart"></i>} />
            <ButtonIconRound icon={<i className="fa-solid fa-ellipsis"></i>} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Track, TrackArtist, TrackShort };
