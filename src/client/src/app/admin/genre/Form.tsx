import { DragDropFile, FormItem } from "@/components/Form";
import React, { useEffect, useState } from "react";

import { ButtonLabel } from "@/components/ui";
import { apiImage, validateFile } from "@/lib/utils";
import uploadService from "@/services/upload.service";
import { GenreRequestDto, IGenre } from "@/types/genre.type";
import styles from "./style.module.scss";

interface Props {
  initialData?: IGenre;
  onClose: () => void;
  onSubmit: (values: GenreRequestDto) => void;
}

const FormGenre = ({ initialData, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<GenreRequestDto>({
    title: "",
    description: "",
    imagePath: "",
    color: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<GenreRequestDto>>({});

  useEffect(() => {
    clearForm();
    if (initialData) {
      setForm({
        title: initialData?.title,
        description: initialData?.description,
        imagePath: initialData?.imagePath,
        color: initialData?.color,
      });
    }
  }, [initialData]);

  const validateForm = (values: GenreRequestDto, imageFile: File | null) => {
    const errors: Partial<GenreRequestDto> = {};
    let hasError = false;

    if (!values?.imagePath && !imageFile) {
      errors.imagePath = "Please upload an image";
      hasError = true;
    }

    if (!values?.title) {
      errors.title = "title is required";
      hasError = true;
    }

    return { errors, hasError };
  };

  const handleChange = (value: Partial<GenreRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    handleChange({ imagePath: "" });

    const { file, error } = validateFile(e);

    if (error) {
      setErrors((prev) => ({ ...prev, imagePath: error }));
      return;
    }

    if (file) {
      setImageFile(file); // Update file if valid, otherwise null
    }
  };

  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      imagePath: "",
      color: "",
    });
    setImageFile(null);
  };

  const handleSubmit = async (formValues: GenreRequestDto) => {
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

      await onSubmit(formValues);
      clearForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={styles.FormGenre}>
      <h4>{"Genre"}</h4>
      <div className={styles.FormGenre_content}>
        <div className={`${styles.FormGenre_content_image} `}>
          <p className={`${styles.title}`}>Thumbnail</p>

          <DragDropFile
            label="Drag and drop your image here"
            name="image"
            className={styles.left_image}
            file={imageFile}
            image_default={(form?.imagePath && apiImage(form?.imagePath)) || ""}
            image={true}
            accept="image/*"
            error={errors.imagePath}
            onChange={(e) => handleChangeImage(e)}
          />

          <span className={styles.desc}>
            Set the song thumbnail image. Only *.png, *.jpg and *.jpeg image
            files are accepted.
          </span>
        </div>
        <div className={styles.FormGenre_content_info}>
          <FormItem
            label="Title"
            name="title"
            value={form?.title || ""}
            onChange={(e) => handleChange({ title: e.target.value })}
            error={errors.title}
          />
          <FormItem
            label="Description"
            name="description"
            type="textarea"
            value={form?.description || ""}
            onChange={(e) => handleChange({ description: e.target.value })}
            error={errors.description}
          />
          <div className={styles.FormGenre_content_info_color}>
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              name="color"
              value={form?.color || ""}
              onChange={(e) => handleChange({ color: e.target.value })}
            />
          </div>
          <div className={styles.buttons}>
            <ButtonLabel
              onClick={() => {
                clearForm();
                onClose();
              }}
              line={true}
              className={styles.buttons_button}
            >
              <label htmlFor="">Cancel</label>
            </ButtonLabel>
            <ButtonLabel
              onClick={() => handleSubmit(form)}
              type="submit"
              className={`${styles.buttons_btnCreate}`}
            >
              <label htmlFor="">Save</label>
            </ButtonLabel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormGenre;
