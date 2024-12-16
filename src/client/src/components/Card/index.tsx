"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { ButtonIconRound } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { IMAGES, paths } from "@/lib/constants";
import { formatNumber, isSongData } from "@/lib/utils";
import avatarExample from "@/public/images/anime.jpg";
import { IPlaylist, ISong } from "@/types";
import { IArtist } from "@/types/index";
import { MotionDiv } from "../Motion";
import styles from "./style.module.scss";

// Hook tùy chỉnh độ rộng của cột dựa vào trạng thái của sidebar và waiting
const useClassNameCol = () => {
  const [classNameCol, setClassNameCol] = useState("col pc-2 t-4 m-6");
  const { isSidebarOpen, isWaitingOpen } = useUI();

  useEffect(() => {
    if (isWaitingOpen) {
      if (isSidebarOpen) {
        setClassNameCol("col pc-1-7 t-3 m-4");
      } else {
        setClassNameCol("col pc-2 t-3 m-4");
      }
    } else {
      if (isSidebarOpen) {
        setClassNameCol("col pc-1-5 t-3 m-4");
      } else {
        setClassNameCol("col pc-1-7 t-3 m-4");
      }
    }
  }, [isSidebarOpen, isWaitingOpen]);
  return classNameCol;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface Props {
  index?: number;
  path?: string;
  isLoading?: boolean;
  className?: string;
  data: ISong | IPlaylist;
}

const Card = (props: Props) => {
  const { index = 1, path, isLoading = false, data, className } = props;
  // const router = useRouter();
  const classNameCol = useClassNameCol();
  const { togglePlayingBar, isPlayingBar } = useUI();
  const isSong = data && isSongData(data);
  const link = path || `${isSong ? paths.SONG : paths.PAYLIST}/${data?.id}`;

  const handlePlay = () => {
    if (!isPlayingBar) {
      togglePlayingBar();
    }
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: (index || 0) * 0.2,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className={`${styles.Card} ${className} ${classNameCol}`}
    >
      <div
        className={`${styles.Card_swapper}`}
        aria-disabled={isLoading ? "true" : "false"}
      >
        <div className={`${styles.Card_swapper_container}`}>
          <div className={`${styles.Card_swapper_container_image}`}>
            {isLoading ? (
              <Skeleton height={"100%"} />
            ) : (
              <Image
                src={data?.image_path || IMAGES.SONG}
                alt="image.png"
                width={200}
                height={200}
                quality={100}
              />
            )}

            <Link href={link}>
              <div
                className={`${styles.Card_swapper_container_image_overlay}`}
              ></div>
            </Link>
            {!isLoading && isSong && (
              <div className={`${styles.Card_swapper_container_image_buttons}`}>
                <ButtonIconRound
                  onClick={() => handlePlay()}
                  size="large"
                  icon={<i className="fa-solid fa-play"></i>}
                />
              </div>
            )}
          </div>
          <div className={`${styles.Card_swapper_container_desc}`}>
            <Link href={link}>
              <h4>
                {isLoading ? (
                  <Skeleton width={"90%"} height={20} />
                ) : (
                  data?.title
                )}
              </h4>
            </Link>
            {isLoading ? (
              <Skeleton
                style={{ marginTop: "6px" }}
                width={"70%"}
                height={20}
              />
            ) : (
              <p className={styles.artists}>
                {data?.owner?.map((owner, index) => (
                  <Link key={index} href={`${paths.ARTIST}/${owner?.id || 1}`}>
                    {owner?.name}
                  </Link>
                ))}
              </p>
            )}
            {isLoading ? (
              <div style={{ marginTop: "6px" }}>
                <Skeleton
                  style={{ marginRight: "12px" }}
                  inline
                  width={"20%"}
                  height={20}
                />
                <Skeleton inline width={"30%"} height={20} />
              </div>
            ) : (
              <>
                <div className={`${styles.tags}`}>
                  {data?.mood &&
                    data?.mood.slice(0, 3).map((mood) => (
                      <div key={mood.id} data-tooltip={mood.title}>
                        <span className={`${styles.tags_tag}`}>
                          {mood.title}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

interface ICardArtist {
  index?: number;
  className?: string;
  isLoading?: boolean;
  path?: string;
  artist: IArtist;
}

const CardArtist = (props: ICardArtist) => {
  const { index, className, path, isLoading = false, artist } = props;
  const router = useRouter();
  const classNameCol = useClassNameCol();

  const handleClick = () => {
    if (path) {
      router.push(path);
    } else {
      router.push(`${paths.ARTIST}/1123`);
    }
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: (index || 0) * 0.2,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className={`${styles.CardArtist} ${className} ${classNameCol}`}
    >
      <div onClick={handleClick} className={`${styles.CardArtist_swapper}`}>
        <div className={`${styles.CardArtist_swapper_container}`}>
          <div className={`${styles.CardArtist_swapper_container_image}`}>
            {isLoading ? (
              <Skeleton circle height={"100%"} />
            ) : (
              <Image
                src={artist?.image_path || IMAGES.AVATAR}
                alt="image.png"
                width={200}
                height={200}
                quality={100}
              />
            )}
          </div>
          <div className={`${styles.CardArtist_swapper_container_desc}`}>
            <h4>{isLoading ? <Skeleton width={50} /> : artist?.name}</h4>
            <p>
              {isLoading ? (
                <Skeleton width={70} />
              ) : (
                formatNumber(artist?.followers) + " follow"
              )}
            </p>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

interface ICardLive {
  id: number;
  img: string;
  title: string;
  author: string;
  isLoading?: boolean;
  className?: string;
}

const CardRoom = ({
  id,
  img,
  title,
  className,
  isLoading = false,
}: ICardLive) => {
  const router = useRouter();
  const classNameCol = useClassNameCol();

  const handleClick = () => {
    router.push(`${paths.ROOM}/1123`);
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: (id || 0) * 0.2,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className={`${styles.CardLive} ${className} ${classNameCol}`}
    >
      <div
        className={`${styles.CardLive_swapper}`}
        aria-disabled={isLoading ? "true" : "false"}
      >
        <div className={`${styles.CardLive_swapper_container}`}>
          <div className={`${styles.CardLive_swapper_container_image}`}>
            {isLoading ? (
              <Skeleton width={"100%"} height={200} />
            ) : img ? (
              <Image
                src={img}
                alt="image.png"
                width={200}
                height={200}
                quality={100}
              />
            ) : (
              <Image
                src={IMAGES.PLAYLIST}
                alt="image.png"
                width={200}
                height={200}
                quality={100}
              />
            )}
            <span>LIVE</span>

            <div
              onClick={handleClick}
              className={`${styles.CardLive_swapper_container_image_overlay}`}
            ></div>

            <div
              className={`${styles.CardLive_swapper_container_image_avatar}`}
            >
              <Image
                src={avatarExample}
                alt="image.png"
                width={50}
                height={50}
                quality={100}
              />
            </div>
          </div>
          <div className={`${styles.CardLive_swapper_container_desc}`}>
            {isLoading ? (
              <Skeleton width={"100%"} />
            ) : (
              <Link href={`${paths.LIVE}/123`}>
                <h4>{title}</h4>
              </Link>
            )}
            {isLoading ? <Skeleton width={"100%"} /> : <p>42 are listening</p>}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export { Card, CardArtist, CardRoom };
