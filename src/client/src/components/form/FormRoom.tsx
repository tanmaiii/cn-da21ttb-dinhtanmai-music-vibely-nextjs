"use client";

import { apiImage, validateImage } from "@/lib/utils";
import { IRoom, ISong, RoomRequestDto } from "@/types";
import React, { useEffect } from "react";
import { ButtonLabel } from "../ui";
import DragDropFile from "./common/DragDropFile";
import styles from "./style.module.scss";
import FormItem from "./common/FormItem";
import Table from "@/components/TablePlaylist";
import { songs as defaultSong } from "@/lib/data";
import { Track } from "../Track";
import uploadService from "@/services/upload.service";
import song from "@/public/images/song.png";
import { songs } from "../../lib/data";
import { useQuery } from "@tanstack/react-query";
import songService from "@/services/song.service";

interface Props {
  onSubmit: (values: RoomRequestDto) => void;
  initialData?: IRoom;
}

const FormRoom = ({ onSubmit, initialData }: Props) => {
  const [values, setValues] = React.useState<RoomRequestDto>({
    title: "",
    description: "",
    imagePath: undefined,
  });
  const [errors, setErrors] = React.useState<Partial<RoomRequestDto>>({});
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [songs, setSongs] = React.useState<ISong[] | []>();

  const handleChange = (value: Partial<RoomRequestDto>) => {
    setValues((prev) => ({ ...prev, ...value }));
  };

  const validateForm = (values: RoomRequestDto, imageFile: File | null) => {
    const errors: Partial<RoomRequestDto> = {};
    let hasError = false;

    if (!values?.imagePath && !imageFile) {
      errors.imagePath = "Please upload an image";
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

    return { errors, hasError };
  };

  const initializeForm = React.useCallback((initialData?: IRoom) => {
    if (initialData) {
      setValues({
        title: initialData.title,
        description: initialData.description,
        imagePath: initialData.imagePath || undefined,
      });
    } else {
      resetForm();
    }
  }, []);

  const resetForm = () => {
    setValues({
      title: "",
      description: "",
      imagePath: undefined,
      songIds: [],
    });
    setImageFile(null);
    setErrors({});
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    setErrors((prev) => ({ ...prev, imagePath: "" })); // Reset error

    const { file, error } = validateImage(e);

    if (!file) {
      handleChange({ imagePath: undefined });
    }

    if (error) {
      setErrors((prev) => ({ ...prev, imagePath: error }));
      return;
    }

    setImageFile(file); // Cập nhật file khi hợp lệ
  };

  useEffect(() => {
    initializeForm(initialData);
  }, [initialData, initializeForm]);

  useEffect(() => {
    handleChange({ songIds: songs?.map((song) => song.id) });
  }, [songs]);

  const handleSubmit = async () => {
    const { errors, hasError } = validateForm(values, imageFile);

    if (hasError) {
      setErrors(errors);
      return;
    }

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const image = await uploadService.upload(formData);
        values.imagePath = image.data.path;
      }

      console.log(values);

      onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={`${styles.FormRoom}`}>
      <div className={`${styles.top}`}>
        <h2 className={`${styles.title}`}>Create Room</h2>
      </div>
      <div className={`${styles.body} `}>
        <div className="row">
          <div className="col pc-8 t-7 m-12">
            <div className={styles.media}>
              <h3 className={`${styles.title}`}>Media</h3>
              <DragDropFile
                className={styles.media_swapper}
                accept=".jpg, .jpeg, .png"
                file={imageFile}
                image_default={
                  values.imagePath ? apiImage(values.imagePath) : ""
                }
                label="Drop image here to upload"
                name="thumbnail"
                onChange={handleChangeImage}
                image={true}
                error={errors.imagePath}
              />
              <span className={styles.desc}>
                Set the song thumbnail image. Only *.png, *.jpg and *.jpeg image
                files are accepted.
              </span>
            </div>

            <ListSong songs={songs} setSongs={setSongs} />
          </div>
          <div className="col pc-4 t-5 m-12">
            <div className={styles.general}>
              <h3 className={`${styles.title}`}>Genneral</h3>
              <FormItem
                label="Title (required)"
                placeholder="Enter title"
                type="text"
                value={values.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                name="title"
                max={60}
                error={errors.title}
              />
              <FormItem
                label="Description"
                placeholder="Enter title"
                type="textarea"
                value={values.description}
                onChange={(e) => handleChange({ description: e.target.value })}
                name="title"
                error={errors.description}
                max={500}
              />
              <div className={styles.buttons}>
                <ButtonLabel line className={`${styles.buttons_btnCancel}`}>
                  <label>Cancel</label>
                </ButtonLabel>

                <ButtonLabel
                  onClick={() => handleSubmit()}
                  className={`${styles.buttons_btnCreate}`}
                >
                  <label>Create</label>
                </ButtonLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRoom;

interface props {
  songs: ISong[] | undefined;
  setSongs: (songs: ISong[]) => void;
}

const ListSong = ({ songs, setSongs }: props) => {
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

  const { data } = useQuery({
    queryKey: ["songs", page],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: page,
        limit: 10,
        sort: "mostListens",
      });
      console.log(res);
      setTotalPage(res.data.totalPages);
      return res.data.data;
    },
  });

  const onSubmit = (song: ISong) => {
    if (!songs?.some((item) => item.id === song.id)) {
      setSongs([...(songs || []), song]);
    }
  };

  const onRefresh = () => {
    if (page < totalPage) {
      console.log(page + 1);
      setPage((prev) => prev + 1);
    } else {
      setPage(1);
    }
  };

  const onRemove = (song: ISong) => {
    setSongs([...(songs || []).filter((item) => item.id !== song.id)]);
  };

  return (
    <>
      {songs && (
        <div className={styles.list_songs}>
          <Table
            onChange={setSongs}
            data={songs}
            renderItem={(item, index) => (
              <Track key={index} song={item} removeSong={onRemove} />
            )}
          />
        </div>
      )}
      <div className={styles.list_songs_recoment}>
        <div className={styles.list_songs_recoment_header}>
          <h4>Recoments</h4>
          <button onClick={onRefresh}>
            <i className="fa-light fa-rotate-right"></i>
            <span>Refesh</span>
          </button>
        </div>
        {data && (
          <Table
            data={
              data.some((item) => songs?.some((song) => song.id === item.id))
                ? data.filter(
                    (item) => !songs?.some((song) => song.id === item.id)
                  )
                : data
            }
            renderItem={(item, index) => (
              <Track key={index} song={item} addSoong={onSubmit} />
            )}
          />
        )}
      </div>
    </>
  );
};
