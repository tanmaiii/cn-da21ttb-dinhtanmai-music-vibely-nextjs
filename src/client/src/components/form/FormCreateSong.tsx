"use client";
import { DragDropFile } from "@/components/Form";
import { paths } from "@/lib/constants";
import { privacy } from "@/lib/data";
import { validateFile } from "@/lib/utils";
import uploadService from "@/services/upload.service";
import ISong, { SongRequestDto } from "@/types/song.type";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import BoxAudio from "../BoxAudio";
import Modal from "../Modal";
import SelectGenre from "../SelectGenre";
import SelectMood from "../SelectMood";
import { ButtonLabel } from "../ui/Button";
import Radio from "../ui/Radio";
import FormItem from "./common/FormItem";
import styles from "./style.module.scss";

interface Props {
  onSubmit: (values: SongRequestDto) => void;
  file: File | null;
  initialData?: ISong;
  open?: boolean;
}

const FormCreateSong = ({ file: fileMp3, onSubmit }: Props) => {
  const [errors, setErrors] = React.useState<Partial<SongRequestDto>>({});
  const [isExit, setIsExit] = React.useState<boolean>(false);
  const router = useRouter();
  const [form, setForm] = React.useState<SongRequestDto>({
    title: "",
    description: "",
    genreId: "",
    moodIds: [],
    imagePath: undefined,
    songPath: "",
    lyricPath: "",
    duration: 0,
    public: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyricFile, setLyricFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(fileMp3);

  const handleChange = (value: Partial<SongRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const validateForm = (values: SongRequestDto, imageFile: File | null) => {
    const errors: Partial<SongRequestDto> = {};
    let hasError = false;

    if (!values?.imagePath && !imageFile) {
      errors.imagePath = "Please upload an image";
      hasError = true;
    }

    if (!values?.songPath && !audioFile) {
      errors.songPath = "Please upload an audio file";
      hasError = true;
    }

    if (!values?.title) {
      errors.title = "Title is required";
      hasError = true;
    }

    if (values?.description?.length > 255) {
      errors.description = "Description is too long";
      hasError = true;
    }

    if (!values?.genreId) {
      errors.genreId = "Genre is required";
      hasError = true;
    }

    return { errors, hasError };
  };

  //Xử lý sự kiện thay đổi file hình ảnh
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    handleChange({ imagePath: "" });
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

    const { file, error } = validateFile(
      e,
      50 * 1024 * 1024,
      ["audio/mpeg"],
      false
    );

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

  const handleSubmit = async (formValues: SongRequestDto) => {
    const { errors, hasError } = validateForm(form, imageFile);
    setErrors(errors);
    if (hasError) return;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const image = await uploadService.upload(formData);
        formValues.imagePath = image.data.path;
      }
      if (audioFile) {
        const formData = new FormData();
        formData.append("audio", audioFile);
        const audio = await uploadService.upload(formData);
        formValues.songPath = audio.data.path;
      }
      if (lyricFile) {
        const formData = new FormData();
        formData.append("lyric", lyricFile);
        const lyric = await uploadService.upload(formData);
        formValues.lyricPath = lyric.data.path;
      }
      await onSubmit(formValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const setDuration = useCallback((value: number) => {
    handleChange({ duration: value });
  }, []);

  return (
    <div className={`${styles.FormCreateSong}`}>
      <div className={`${styles.top}`}>
        {audioFile && (
          <BoxAudio
            file={audioFile}
            setDuration={(value) => setDuration(value)}
          />
        )}
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
                error={errors.title}
              />
              <FormItem
                label="Description"
                placeholder="Enter title"
                type="textarea"
                value={form.description}
                onChange={(e) => handleChange({ description: e.target.value })}
                name="description"
                max={500}
                error={errors.description}
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
                error={errors.moodIds}
                value={form.moodIds}
                handleChange={(value) => handleChange({ moodIds: value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <ButtonLabel
          onClick={() => setIsExit(true)}
          className={`${styles.buttons_btnCancel}`}
        >
          <label>Cancel</label>
        </ButtonLabel>

        <ButtonLabel
          onClick={() => handleSubmit(form)}
          className={`${styles.buttons_btnCreate}`}
        >
          <label>Create</label>
        </ButtonLabel>
      </div>

      <Modal show={isExit} onClose={() => setIsExit(false)}>
        <div className={styles.modal_exit}>
          <h4>Are you sure you want to exit?</h4>
          <div className={styles.modal_exit_buttons}>
            <ButtonLabel onClick={() => setIsExit(true)}>
              <label>Cancel</label>
            </ButtonLabel>

            <ButtonLabel
              onClick={() => router.push(paths.HOME)}
              className={`col ${styles.buttons_btnCreate}`}
            >
              <label>Yes</label>
            </ButtonLabel>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FormCreateSong;
