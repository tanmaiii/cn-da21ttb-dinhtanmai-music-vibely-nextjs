"use client";

import { IMAGES, paths } from "@/lib/constants";
import { apiImage } from "@/lib/utils";
import genreService from "@/services/genre.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

const Search = () => {
  const [history, setHistory] = useState<string[]>(["We don", "EDM", "Jack"]);
  const router = useRouter();
  const { data: genres } = useQuery({
    queryKey: ["genre"],
    queryFn: async () => {
      const res = await genreService.getAll({});
      return res.data.data;
    },
  });

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("search-history") || "[]");
    if (prev) {
      setHistory(prev);
    }
  }, []);

  return (
    <div className={`${styles.Search}`}>
      {history && history.length > 0 && (
        <div className={`${styles.Search_history}`}>
          <h4>History</h4>
          <div className={`${styles.Search_history_list}`}>
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(paths.SEARCH + "/" + item)}
                className={`${styles.Search_history_list_item}`}
              >
                <i className="fa-light fa-magnifying-glass"></i>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={`${styles.Search_genre}`}>
        <h4>Genre</h4>
        <div className={`${styles.Search_genre_list} row`}>
          {genres &&
            genres.map((item, index) => (
              <div key={index} className={`col pc-2-4 t-4 m-6`}>
                <button
                  onClick={() => router.push(paths.GENRE + "/" + item.id)}
                  className={`${styles.Search_genre_list_item}`}
                  style={{ backgroundColor: `${item.color}` }}
                >
                  <p>{item.title}</p>
                  <Image
                    src={
                      item.imagePath ? apiImage(item.imagePath) : IMAGES.SONG
                    }
                    alt={item.title}
                    width={300}
                    height={300}
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
