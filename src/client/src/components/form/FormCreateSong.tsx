"use client";
import { useCustomToast } from "@/hooks/useToast";
import { genres, moods, privacy } from "@/lib/data";
import formatFileSize from "@/lib/utils";
import React, { useState } from "react";
import { ButtonLabel } from "../ui/Button";
import DragDropFile from "./DragDropFile";
import Dropdown from "./Dropdown";
import FormItem from "./FormItem";
import MultipleSelect, { IOptionSelect } from "./MultipleSelect";
import Radio from "../ui/Radio";
import styles from "./style.module.scss";

const FormCreateSong = () => {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const { toastError } = useCustomToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyricFile, setLyricFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [genreSelect, setGenreSelect] = React.useState<
    IOptionSelect | undefined
  >(undefined);

  // const [mood, setMood] = React.useState<IOptionSelect | undefined>(undefined);
  const [moodSelect, setMoodSelect] = React.useState<
    IOptionSelect[] | undefined
  >(undefined);

  //Xử lý sự kiện thay đổi file hình ảnh
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const file = e.target.files && e.target.files[0];
    const size = 5 * 1024 * 1024;
    if (file && file?.size > size) {
      toastError(`Image size must be less than ${formatFileSize(size)}`);
      return;
    }

    if (file && !validImageTypes.includes(file.type)) {
      toastError("Only accept .png, .jpg, .jpeg files");
      return;
    }
    setImageFile(file);
  };

  const onChangeAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(null);
    const file = e.target.files && e.target.files[0];
    const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
    const size = 10 * 1024 * 1024;
    if (file && file?.size > size) {
      toastError(`Audio size must be less than ${formatFileSize(size)}`);
      return;
    }
    if (file && !validAudioTypes.includes(file.type)) {
      toastError("Only accept .mp3, .wav, .ogg files");
      return;
    }
    setAudioFile(file);
  };

  const onChangeLyric = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLyricFile(null);
    const file = e.target.files && e.target.files[0];
    if (file && file.name.split(".").pop() !== "lrc") {
      toastError("Accept only .lrc files");
      return;
    } else {
      setLyricFile(file);
    }
  };

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

      <div className={`${styles.body} `}>
        <div className="row">
          <div className="col pc-8 t-8 m-12">
            <div className={styles.general}>
              <h3 className={`${styles.title}`}>Genneral</h3>
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
            </div>

            <div className={styles.media}>
              <h3 className={`${styles.title}`}>Media</h3>
              <DragDropFile
                className={styles.media_swapper}
                accept="audio/*"
                file={audioFile}
                label="Drop audio here to upload"
                name="audio"
                onChange={(file) => onChangeAudio(file)}
              />
              <span className={styles.desc}>
                Upload your song in mp3 format. Maximum file size 50MB.
              </span>
            </div>

            <div className={styles.privacy}>
              <Radio label="Privacy" name="privacy" options={privacy} />
            </div>
          </div>
          <div className="col pc-4 t-4 m-12">
            <div className={`${styles.thumbnail} `}>
              <div className={`${styles.image} `}>
                <p className={`${styles.title}`}>Thumbnail</p>

                <DragDropFile
                  className={styles.image_swapper}
                  accept=".jpg, .jpeg, .png"
                  file={imageFile}
                  label="Drop image here to upload"
                  name="thumbnail"
                  onChange={(file) => onChangeImage(file)}
                  image={true}
                />

                <span className={styles.desc}>
                  Set the song thumbnail image. Only *.png, *.jpg and *.jpeg
                  image files are accepted.
                </span>
              </div>
            </div>

            <div className={styles.lyrics}>
              <p className={`${styles.title}`}>Lyric</p>
              <DragDropFile
                className={styles.lyrics_swapper}
                accept=".lrc"
                file={lyricFile}
                label="Drop lyric here to upload"
                name="lyric"
                onChange={(file) => onChangeLyric(file)}
              />
              <span className={styles.desc}>
                Upload your song lyric in lrc format. Maximum file size 5MB.
              </span>
            </div>

            <div className={styles.details}>
              <h3 className={`${styles.title}`}>Song details</h3>

              <Dropdown
                label="Genre"
                desc="Add song to a genre."
                name="genre"
                options={genres.map((g) => {
                  return { value: g.id, label: g.title };
                })}
                value={genreSelect}
                onChange={(valueSelect) => setGenreSelect(valueSelect)}
              />

              <MultipleSelect
                label="Mood"
                desc="Add tags for song."
                name="mood"
                options={moods.map((g) => {
                  return { value: g.id, label: g.title };
                })}
                values={moodSelect}
                onChange={(value) => setMoodSelect(value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <ButtonLabel line className={`${styles.buttons_btnCancel}`}>
          <label>Cancel</label>
        </ButtonLabel>

        <ButtonLabel className={`${styles.buttons_btnCreate}`}>
          <label>Create</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default FormCreateSong;
