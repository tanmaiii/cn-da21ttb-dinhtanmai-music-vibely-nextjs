import { genres, moods, privacy } from "@/lib/data";
import React from "react";
import { ButtonLabel } from "../ui/Button";
import { DragDropFile, FormItem, MultipleSelect } from "../form";
import Dropdown from "../form/Dropdown";
import Radio from "../ui/Radio";
import styles from "./style.module.scss";
import { useCustomToast } from "@/hooks/useToast";
import formatFileSize from "@/lib/utils";

const EditPlaylist = () => {
  const { toastError } = useCustomToast();
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    image_path: "https://picsum.photos/900/900",
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    setForm((prev) => ({ ...prev, image_path: "" }));
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

  return (
    <div className={styles.EditPlaylist}>
      <div className={styles.header}>
        <h2>Edit Playlist</h2>
      </div>
      <div className={`${styles.body} row`}>
        {/* <div className="row"> */}
        <div className="col pc-4 t-5 m-12">
          <div className={styles.left}>
            <DragDropFile
              label="Drag and drop your image here"
              name="image"
              className={styles.left_image}
              file={imageFile}
              image_default={form.image_path}
              image={true}
              accept="image/*"
              onChange={(e) => handleChangeImage(e)}
            />
            <div>
              <Radio label="Privacy" name="privacy" options={privacy} />
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
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                value={form.title}
              />
              <FormItem
                name="description"
                type="textarea"
                placeholder="Enter description..."
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                value={form.description}
              />
              <Dropdown
                label="Genre"
                name="genre"
                options={genres.map((g) => {
                  return { label: g.title, value: g.id };
                })}
                onChange={(e) => console.log(e)}
              />
              <MultipleSelect
                label="Mood"
                name="mood"
                options={moods.map((g) => {
                  return { label: g.title, value: g.id };
                })}
                onChange={(e) => console.log(e)}
              />
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className={styles.footer}>
        <ButtonLabel className={styles.footer_button}>
          <label htmlFor="">Cancel</label>
        </ButtonLabel>
        <ButtonLabel className={styles.footer_button}>
          <label htmlFor="">Save</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default EditPlaylist;
