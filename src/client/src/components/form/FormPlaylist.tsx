import { useCustomToast } from "@/hooks/useToast";
import { genres, moods, privacy } from "@/lib/data";
import { apiImage, formatFileSize } from "@/lib/utils";
import { IPlaylist, PlaylistRequestDto } from "@/types";
import React, { useEffect } from "react";
import { DragDropFile, FormItem, MultipleSelect } from "../Form";
import Dropdown from "../Form/common/Dropdown";
import { ButtonLabel } from "../ui/Button";
import Radio from "../ui/Radio";
import styles from "./style.module.scss";
import uploadService from "@/services/upload.service";

interface Props {
  onSubmit: (values: PlaylistRequestDto) => void;
  initialData?: IPlaylist;
  open?: boolean;
  onClose: () => void;
}

const FormPlaylist = ({ onSubmit, initialData, open, onClose }: Props) => {
  const { toastError } = useCustomToast();
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Partial<PlaylistRequestDto>>({});
  const [values, setValues] = React.useState<PlaylistRequestDto>({
    title: "",
    description: "",
    genreId: "",
    moodIds: [],
    public: true,
    imagePath: undefined,
  });

  const validateForm = (values: PlaylistRequestDto, imageFile: File | null) => {
    const errors: Partial<PlaylistRequestDto> = {};
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

    if (!values?.genreId) {
      errors.genreId = "Genre is required";
      hasError = true;
    }

    return { errors, hasError };
  };

  const initializeForm = React.useCallback((initialData?: IPlaylist) => {
    if (initialData) {
      setValues({
        title: initialData.title,
        description: initialData.description,
        genreId: initialData.genre?.id || "",
        moodIds: initialData.moods
          ? initialData.moods.map((mood) => mood.id)
          : [],
        public: initialData.public,
        imagePath: initialData.imagePath || undefined,
      });
    } else {
      resetForm();
    }
  }, []);

  // Reset form values
  const resetForm = () => {
    setValues({
      title: "",
      description: "",
      genreId: "",
      moodIds: [],
      public: true,
      imagePath: undefined,
    });
    setImageFile(null);
    setErrors({});
  };

  const handleChange = (value: Partial<PlaylistRequestDto>) => {
    setValues((prev) => ({ ...prev, ...value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const file = e.target.files && e.target.files[0];
    const size = 5 * 1024 * 1024;

    if (!file) handleChange({ imagePath: undefined });

    if (file && file?.size > size) {
      toastError(`Image size must be less than ${formatFileSize(size)}`);
      return;
    }

    if (file && !validImageTypes.includes(file.type)) {
      toastError("Only accept .png, .jpg, .jpeg files");
      setErrors((prev) => ({
        ...prev,
        image: "Only accept .png, .jpg, .jpeg files",
      }));
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (formValues: PlaylistRequestDto) => {
    const { errors, hasError } = validateForm(values, imageFile);
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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    initializeForm(initialData);
    if (!open) resetForm();
  }, [initialData, open, initializeForm]);

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
              image_default={
                (values?.imagePath && apiImage(values?.imagePath)) || ""
              }
              image={true}
              accept="image/*"
              error={errors.imagePath}
              onChange={(e) => handleChangeImage(e)}
            />
            <div>
              <Radio
                onChange={(v) =>
                  handleChange({ public: v == "public" ? true : false })
                }
                label="Privacy"
                value={values?.public ? "public" : "private"}
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
                error={errors.genreId}
                value={values.genreId}
                options={genres.map((g) => {
                  return { label: g.title, value: g.id };
                })}
                onChange={(e) => handleChange({ genreId: e.value })}
              />
              <MultipleSelect
                label="Mood"
                name="mood"
                // error={errors.moodIds}
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
        <ButtonLabel
          onClick={handleClose}
          line={true}
          className={styles.footer_button}
        >
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
