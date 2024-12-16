import { IMAGES } from "@/lib/constants";
import { genres } from "@/lib/data";
import Image from "next/image";
import styles from "./style.module.scss";

const Search = () => {
  return (
    <div className={`${styles.Search}`}>
      <div className={`${styles.Search_history}`}>
        <h4>History</h4>
        <div className={`${styles.Search_history_list}`}>
          <div className={`${styles.Search_history_list_item}`}>
            <i className="fa-light fa-magnifying-glass"></i>
            <span>History 1</span>
          </div>
          <div className={`${styles.Search_history_list_item}`}>
            <i className="fa-light fa-magnifying-glass"></i>
            <span>History 1</span>
          </div>
          <div className={`${styles.Search_history_list_item}`}>
            <i className="fa-light fa-magnifying-glass"></i>
            <span>History 1</span>
          </div>
        </div>
      </div>
      <div className={`${styles.Search_genre}`}>
        <h4>Genre</h4>
        <div className={`${styles.Search_genre_list} row`}>
          {genres.map((item, index) => (
            <div key={index} className={`col pc-2-4 t-4 m-6`}>
              <div
                className={`${styles.Search_genre_list_item}`}
                style={{ backgroundColor: `${item.color}` }}
              >
                <p>{item.title}</p>
                <Image
                  src={item.imagePath || IMAGES.SONG}
                  alt={item.title}
                  width={300}
                  height={300}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
