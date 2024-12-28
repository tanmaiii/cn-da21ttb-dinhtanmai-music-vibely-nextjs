import { IMAGES, paths } from "@/lib/constants";
import { apiImage, formatImg, formatNumber, isSongData } from "@/lib/utils";
import { IArtist, IPlaylist, ISong } from "@/types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import styles from "./style.module.scss";

interface Props {
  data: ISong | IPlaylist;
  isLoading?: boolean;
  onEdit?: () => void;
  isFavorites?: boolean;
}

const HeaderPage = (props: Props) => {
  const { data, isLoading = false, onEdit } = props;
  const isSong = data && isSongData(data);

  return (
    <div className={`${styles.HeaderPage}`}>
      {!isLoading && (
        <div className={`${styles.HeaderPage_blur}`}>
          <div
            className={`${styles.HeaderPage_blur_bgAlpha}`}
            style={{
              backgroundImage: `url(${
                data?.imagePath ? formatImg(apiImage(data?.imagePath)) : ""
              })`,
            }}
          ></div>
          <div className={`${styles.HeaderPage_blur_alpha}`}></div>
        </div>
      )}
      <div className={`${styles.body}`}>
        <div className={`${styles.avatar}`}>
          {isLoading ? (
            <Skeleton width={"100%"} height={"100%"} />
          ) : (
            <>
              <Image
                src={
                  (data?.imagePath && formatImg(apiImage(data?.imagePath))) ||
                  (props.isFavorites ? IMAGES.FAVORITES : IMAGES.SONG)
                }
                width={200}
                height={200}
                alt=""
              />
              {onEdit && (
                <div className={styles.edit} onClick={onEdit}>
                  <i className="fa-light fa-edit"></i>
                  <span>Edit</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className={`${styles.info}`}>
          {isLoading ? (
            <Skeleton width={50} height={20} />
          ) : (
            <p>
              {!data?.public && <i className="fa-light fa-lock"></i>}
              <span>{isSong ? "Song" : "Playlist"}</span>
              {!props.isFavorites && <span> - {data?.genre?.title}</span>}
            </p>
          )}

          {isLoading ? (
            <Skeleton width={400} height={60} />
          ) : (
            <h4
              style={{
                fontSize: (data?.title || "").length > 24 ? "40px" : "60px",
              }}
            >
              {data?.title}
            </h4>
          )}

          {isLoading ? (
            <Skeleton width={300} height={20} />
          ) : (
            <span>{data?.description}</span>
          )}
          {isLoading ? (
            <Skeleton width={600} height={20} />
          ) : (
            <div className={`${styles.info_desc}`}>
              {!props.isFavorites && (
                <div className={`${styles.info_desc_author}`}>
                  <Image
                    src={
                      (data?.creator?.imagePath &&
                        apiImage(data?.creator?.imagePath)) ||
                      IMAGES.AVATAR
                    }
                    width={20}
                    height={20}
                    alt="image.png"
                  />
                  <Link href={`${paths.ARTIST}/${data?.creator?.slug}`}>
                    {data?.creator.name}
                  </Link>
                </div>
              )}
              {data?.createdAt && (
                <div className={`${styles.info_desc_item}`}>
                  <i className="fa-light fa-clock"></i>
                  <span>{moment(data?.createdAt).format("YYYY")}</span>
                </div>
              )}
              {isSong && data?.listens > 0 && (
                <div className={`${styles.info_desc_item}`}>
                  <i className="fa-light fa-headphones"></i>
                  <span>{formatNumber(data?.listens)} listens</span>
                </div>
              )}
              {data?.likes > 0 && (
                <div className={`${styles.info_desc_item}`}>
                  <i className="fa-light fa-heart"></i>
                  <span>{formatNumber(data?.likes)} likes</span>
                </div>
              )}
              {!isSong && data?.songsCount > 0 && (
                <div className={`${styles.info_desc_item}`}>
                  <i className="fa-thin fa-album"></i>
                  <span>{formatNumber(data?.songsCount)} songs</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ArtistProps {
  artist: IArtist;
  isLoading?: boolean;
}

const HeaderPageArtist = (props: ArtistProps) => {
  const { artist } = props;
  return (
    <div className={`${styles.HeaderPageArtist}`}>
      <div className={`${styles.HeaderPageArtist_blur}`}>
        <div className={`${styles.HeaderPageArtist_blur_alpha}`}></div>
        <div
          className={`${styles.HeaderPageArtist_blur_bgAlpha}`}
          style={{
            backgroundImage: `url(${
              artist.imagePath ? formatImg(apiImage(artist?.imagePath)) : ""
            })`,
          }}
        ></div>
      </div>
      <div className={`${styles.HeaderPageArtist_body}`}>
        <div className={`${styles.HeaderPageArtist_body_avatar}`}>
          <Image
            src={
              (artist?.imagePath && apiImage(artist?.imagePath)) ||
              IMAGES.AVATAR
            }
            width={90}
            height={90}
            alt="avatar"
          />
        </div>
        <div className={`${styles.HeaderPageArtist_body_info}`}>
          <p>
            <span>Artist</span>
          </p>
          <h4
            style={{
              fontSize: (artist?.name || "").length > 24 ? "40px" : "60px",
            }}
          >
            {artist?.name}
          </h4>
          <div className={`${styles.HeaderPageArtist_body_info_desc}`}>
            {/* <div className={`${styles.HeaderPageArtist_body_info_desc_item}`}>
              <i className="fa-light fa-headphones"></i>
              <span>{formatNumber(12312312)}</span>
            </div> */}
            <div className={`${styles.HeaderPageArtist_body_info_desc_item}`}>
              <i className="fa-light fa-heart"></i>
              <span>{formatNumber(artist.followers)}</span>
            </div>
            <div className={`${styles.HeaderPageArtist_body_info_desc_item}`}>
              <i className="fa-light fa-music"></i>
              <span>{formatNumber(artist.songs)} songs</span>
            </div>
            <div className={`${styles.HeaderPageArtist_body_info_desc_item}`}>
              <i className="fa-thin fa-album"></i>
              <span>{formatNumber(artist.playlists)} playlists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeaderPage, HeaderPageArtist };
