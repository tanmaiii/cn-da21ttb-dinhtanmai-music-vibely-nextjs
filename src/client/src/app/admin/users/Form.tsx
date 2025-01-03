import { DragDropFile, Dropdown, FormItem } from "@/components/Form";
import { IUser, UserRequestDto } from "@/types/auth.type";
import React, { useEffect, useState } from "react";

import { ButtonLabel } from "@/components/ui";
import { apiImage, validateFile } from "@/lib/utils";
import roleService from "@/services/role.service";
import uploadService from "@/services/upload.service";
import { useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";

interface Props {
  initialData?: IUser;
  onClose: () => void;
  onSubmit: (values: UserRequestDto) => void;
}

const FormUser = ({ initialData, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<UserRequestDto>({
    name: "",
    email: "",
    password: "",
    role: "",
    imagePath: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<UserRequestDto>>({});

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await roleService.getAllRole();
      return res.data;
    },
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        password: "",
        role: initialData.role.id,
      });
    }
  }, [initialData]);

  const validateForm = (values: UserRequestDto, imageFile: File | null) => {
    const errors: Partial<UserRequestDto> = {};
    let hasError = false;

    if (!values?.imagePath && !imageFile) {
      errors.imagePath = "Please upload an image";
      hasError = true;
    }

    if (!values?.name) {
      errors.name = "Name is required";
      hasError = true;
    }

    if (!values?.password) {
      errors.password = "Password is required";
      hasError = true;
    }

    if (!values?.email) {
      errors.email = "Email is required";
      hasError = true;
    }

    if (!values?.role) {
      errors.role = "Role is required";
      hasError = true;
    }

    return { errors, hasError };
  };

  const handleChange = (value: Partial<UserRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(null);
    handleChange({ imagePath: "" });

    const { file, error } = validateFile(e);

    console.log(file, error);

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
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleSubmit = async (formValues: UserRequestDto) => {
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

      console.log(formValues);

      await onSubmit(formValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={styles.form_user}>
      <h4>{initialData ? "User" : "Create user"}</h4>
      <div className={styles.form_user_content}>
        <div className={`${styles.form_user_content_image} `}>
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
        <div className={styles.form_user_content_info}>
          <FormItem
            label="Name"
            name="name"
            value={form?.name || ""}
            onChange={(e) => handleChange({ name: e.target.value })}
            error={errors.name}
          />
          <FormItem
            label="Email"
            name="email"
            value={form?.email || ""}
            onChange={(e) => handleChange({ email: e.target.value })}
            error={errors.email}
          />
          <FormItem
            label="Password"
            name="password"
            type="password"
            value={form?.password || ""}
            onChange={(e) => handleChange({ password: e.target.value })}
            error={errors.password}
          />
          <div className="pt-3">
            <Dropdown
              label="Role"
              name="role"
              value={form?.role || ""}
              onChange={(role) => handleChange({ role: role.value })}
              options={
                roles?.map((role) => ({
                  label: role.name,
                  value: role.id,
                })) || []
              }
              error={errors.role}
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

export default FormUser;
