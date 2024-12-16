"use client";
import { genres, moods, privacy } from "@/lib/data";
import imgDefault from "@/public/images/anime.jpg";
import Image from "next/image";
import React from "react";
import { ButtonLabel } from "../ui/Button";
import Dropdown from "./Dropdown";
import FormItem from "./FormItem";
import Radio from "../ui/Radio";
import styles from "./style.module.scss";

const FormCreateSong = () => {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [genre, setGenre] = React.useState<
    | {
        value: string;
        label: string;
      }
    | undefined
  >(undefined);
  const [mood, setMood] = React.useState<
    | {
        value: string;
        label: string;
      }
    | undefined
  >(undefined);

  return (
    <div className={`${styles.FormCreateSong}`}>
      <div className={`${styles.top}`}>
        {/* <BoxAudio file={fileMp3} stop={true} /> */}

        <audio
          id="audio"
          src={"/audio/song.mp3"}
          // src={song && apiConfig.mp3Url(song?.song_path)}
          autoPlay
        ></audio>

        {/* <Waveform audioFile={"/audio/song.mp3"} /> */}
      </div>
      
      <div className={`${styles.body} row`}>
        <div className={`${styles.left} col pc-9 t-8 m-12`}>
          <h3 className={`${styles.title}`}>Create Song</h3>
          <FormItem
            label="Title (required)"
            placeholder="Enter title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            max={60}
          />
          <FormItem
            label="Description"
            placeholder="Enter title"
            type="textarea"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            name="title"
            max={500}
          />

          <div className={`${styles.dropdowns}`}>
            <div className="row">
              <div className="col pc-6 t-6 m-12">
                <Dropdown
                  label="Category"
                  name="category"
                  options={genres.map((g) => {
                    return { value: g.id, label: g.title };
                  })}
                  value={genre}
                  onChange={(value) => setGenre(value)}
                />
              </div>
              <div className="col pc-6 t-6 m-12">
                <Dropdown
                  label="Mood"
                  name="mood"
                  options={moods.map((g) => {
                    return { value: g.id, label: g.title };
                  })}
                  value={mood}
                  onChange={(value) => setMood(value)}
                />
              </div>
            </div>
          </div>

          <Radio label="Privacy" name="privacy" options={privacy} />
        </div>
        <div className={`${styles.right} col pc-3 t-4 m-12`}>
          <div className={`${styles.image} `}>
            <label htmlFor="">
              Image <span>(optional)</span>
            </label>
            <div className={`${styles.image_swapper}`}>
              <Image src={imgDefault} width={400} height={400} alt="" />
              <label
                htmlFor="upload-image"
                className={`${styles.image_swapper_label}`}
              >
                <i className="fa-light fa-image"></i>
                <span>Upload</span>
                <input id="upload-image" type="file" hidden />
              </label>
            </div>
          </div>
          <div className={styles.lyrics}>
            <label htmlFor="">
              Lyric <span>(optional)</span>
            </label>
            <div className={styles.lyrics_swapper}>
              <label
                htmlFor="input-lyric-song"
                className={styles.lyrics_swapper_default}
              >
                <i className="fa-light fa-file-alt"></i>
                <span>Upload</span>
                <input type="file" id="input-lyric-song" accept="lrc" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.footer}`}>
        <ButtonLabel line className={`${styles.footer_btnCancel}`}>
          <label>Back</label>
        </ButtonLabel>

        <ButtonLabel className={`${styles.footer_btnCreate}`}>
          <label>Next</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default FormCreateSong;
