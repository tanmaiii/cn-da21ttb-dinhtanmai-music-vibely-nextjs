"use client";
import { DragDropFile } from "@/components/Form";
import { privacy } from "@/lib/data";
import { validateFile } from "@/lib/utils";
import ISong, { SongRequestDto } from "@/types/song.type";
import React, { useState } from "react";
import SelectGenre from "../SelectGenre";
import SelectMood from "../SelectMood";
import { ButtonLabel } from "../ui/Button";
import Radio from "../ui/Radio";
import FormItem from "./common/FormItem";
import styles from "./style.module.scss";
import BoxAudio from "../BoxAudio";

interface Props {
  onSubmit: (values: SongRequestDto) => void;
  file: File | null;
  initialData?: ISong;
  open?: boolean;
}

const FormCreateSong = ({ file: fileMp3 }: Props) => {
  // const { toastError } = useCustomToast();
  const [errors, setErrors] = React.useState<Partial<SongRequestDto>>({});
  const [form, setForm] = React.useState<SongRequestDto>({
    title: "",
    description: "",
    genreId: "",
    moodIds: [],
    imagePath: undefined,
    songPath: "",
    lyricPath: "",
    public: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyricFile, setLyricFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(fileMp3);

  const handleChange = (value: Partial<SongRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  //Xử lý sự kiện thay đổi file hình ảnh
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    setErrors((prev) => ({ ...prev, imagePath: "" })); // Reset error

    const { file, error } = validateFile(e);

    if (error) {
      setErrors((prev) => ({ ...prev, imagePath: error }));
      return;
    }

    setImageFile(file || null); // Update file if valid, otherwise null
  };

  const onChangeAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(null);
    setErrors((prev) => ({ ...prev, songPath: "" })); // Reset error

    const { file, error } = validateFile(e, 50 * 1024 * 1024, ["audio/mpeg"]);

    if (error) {
      setErrors((prev) => ({ ...prev, songPath: error }));
      return;
    }

    setAudioFile(file || null); // Update file if valid, otherwise null
  };

  const onChangeLyric = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLyricFile(null);
    setErrors((prev) => ({ ...prev, lyricPath: "" })); // Reset error

    const { file, error } = validateFile(e, 5 * 1024 * 1024, ["lrc"]);

    if (error) {
      setErrors((prev) => ({ ...prev, lyricPath: error }));
      return;
    }

    setLyricFile(file || null); // Update file if valid, otherwise null
  };

  return (
    <div className={`${styles.FormCreateSong}`}>
      <div className={`${styles.top}`}>
        {audioFile && <BoxAudio file={audioFile} />}
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
                value={form.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                name="title"
                max={60}
              />
              <FormItem
                label="Description"
                placeholder="Enter title"
                type="textarea"
                value={form.description}
                onChange={(e) => handleChange({ description: e.target.value })}
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
                error={errors.songPath}
              />
              <span className={styles.desc}>
                Upload your song in mp3 format. Maximum file size 50MB.
              </span>
            </div>

            <div className={styles.privacy}>
              <Radio
                onChange={(v) =>
                  handleChange({ public: v == "public" ? true : false })
                }
                label="Privacy"
                value={form?.public ? "public" : "private"}
                name="privacy"
                options={privacy}
              />
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
                  error={errors.imagePath}
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
                error={errors.lyricPath}
              />
              <span className={styles.desc}>
                Upload your song lyric in lrc format. Maximum file size 5MB.
              </span>
            </div>

            <div className={styles.details}>
              <h3 className={`${styles.title}`}>Song details</h3>

              <SelectGenre
                error={errors.genreId}
                value={form.genreId}
                handleChange={(value) => handleChange({ genreId: value })}
              />

              <SelectMood
                value={form.moodIds}
                error={errors.moodIds}
                handleChange={(value) => handleChange({ moodIds: value })}
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
