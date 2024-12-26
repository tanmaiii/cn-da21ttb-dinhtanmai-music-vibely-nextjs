import { useCustomToast } from "@/hooks/useToast";
import { genres, moods, privacy } from "@/lib/data";
import { formatFileSize } from "@/lib/utils";
import playlistService from "@/services/playlist.service";
import { IBodyCreatePlaylist } from "@/types/playlist.type";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import * as Yup from "yup";
import { DragDropFile, FormItem, MultipleSelect } from "../form";
import Dropdown from "../form/Dropdown";
import { ButtonLabel } from "../ui/Button";
import Radio from "../ui/Radio";
import styles from "./style.module.scss";

interface Props {
  onSubmit: (values: IBodyCreatePlaylist) => void;
  initalData?: IBodyCreatePlaylist;
}

const FormPlaylist = ({ onSubmit }: Props) => {
  const { toastError, toastSuccess } = useCustomToast();
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState({
    title: "",
    description: "",
    genreId: "",
    moodIds: "",
    public: "",
  });
  const [values, setValues] = React.useState<IBodyCreatePlaylist>({
    title: "",
    description: "",
    genreId: "",
    moodIds: [],
    public: true,
  });

  const handleChange = (value: Partial<IBodyCreatePlaylist>) => {
    setValues((prev) => ({ ...prev, ...value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    // setForm((prev) => ({ ...prev, imagePath: "" }));
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
  const handleSubmit = async (values: IBodyCreatePlaylist) => {
    onSubmit(values);
  };

  return (
    <div className={styles.FormPlaylist}>
      <div className={styles.header}>
        <h2>Form Playlist</h2>
      </div>
      <div className={`${styles.body} row`}>
        <div className="col pc-4 t-5 m-12">
          <div className={styles.left}>
            <DragDropFile
              label="Drag and drop your image here"
              name="image"
              className={styles.left_image}
              file={imageFile}
              // image_default={form.imagePath}
              image={true}
              accept="image/*"
              onChange={(e) => handleChangeImage(e)}
            />
            <div>
              <Radio
                onChange={(v) =>
                  handleChange({ public: v == "public" ? true : false })
                }
                label="Privacy"
                value="public"
                name="privacy"
                options={privacy}
              />
            </div>
          </div>
        </div>
        <div className="col pc-8 t-7 m-12">
          <div className={styles.right}>
            <div className={styles.right_body}>
              <FormItem
                name="title"
                type="text"
                placeholder="Enter title..."
                value={values.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                error={errors.title}
              />
              <FormItem
                name="description"
                type="textarea"
                placeholder="Enter description..."
                onChange={(e) => handleChange({ description: e.target.value })}
                value={values.description}
                error={errors.description}
              />
              <Dropdown
                label="Genre"
                name="genreId"
                value={values.genreId}
                options={genres.map((g) => {
                  return { label: g.title, value: g.id };
                })}
                onChange={(e) => handleChange({ genreId: e.value })}
              />
              <MultipleSelect
                label="Mood"
                name="mood"
                options={moods.map((g) => {
                  return { label: g.title, value: g.id };
                })}
                values={values?.moodIds}
                onChange={(e) => handleChange({ moodIds: e })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <ButtonLabel line={true} className={styles.footer_button}>
          <label htmlFor="">Cancel</label>
        </ButtonLabel>
        <ButtonLabel
          onClick={() => handleSubmit(values)}
          type="submit"
          className={styles.footer_button}
        >
          <label htmlFor="">Save</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default FormPlaylist;
