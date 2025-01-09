"use client";

import { useCustomToast } from "@/hooks/useToast";
import { IMAGES } from "@/lib/constants";
import { RootState } from "@/lib/store";
import { apiImage, validateFile } from "@/lib/utils";
import userService from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import uploadService from "@/services/upload.service";

const SettingsPage = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  const { toastError, toastSuccess } = useCustomToast();
  const queryClient = useQueryClient();

  const mutationSave = useMutation({
    mutationFn: async ({ name, value }: { name: string; value: string }) => {
      return (
        currentUser &&
        (await userService.update(currentUser.id, { [name]: value }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toastSuccess("Update user successfully");
    },
    onError: (error: unknown) => {
      toastError((error as Error).message);
    },
  });

  if (!currentUser) return null;

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    const { error, file } = validateFile(e, 5 * 1024 * 1024, [
      "image/jpeg",
      "image/png",
    ]);

    if (error) return toastError(error);

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadService.upload(formData);
      if (res) {
        mutationSave.mutate({ name: "imagePath", value: res.data.path });
      }
    }
  };

  return (
    <div className={styles.Settings}>
      <div className={styles.Settings_content}>
        <div className={styles.Settings_content_header}>
          <h4>Settings</h4>
        </div>
        <div className={styles.Settings_content_body}>
          <div className={styles.Settings_avatar}>
            <div className={styles.Settings_avatar_img}>
              <Image
                src={
                  currentUser?.imagePath
                    ? apiImage(currentUser?.imagePath)
                    : IMAGES.AVATAR
                }
                alt=""
                width={100}
                height={100}
              />
            </div>
            <div className={styles.Settings_avatar_desc}>
              <h5>{currentUser?.name}</h5>
              <p>{currentUser?.email}</p>
            </div>

            <button>
              <label htmlFor="image_avatar">Change Image </label>
            </button>

            <input
              type="file"
              onChange={handleChangeImage}
              id="image_avatar"
              hidden
              accept="image/*"
            />
          </div>
          <div className={styles.Settings_account}>
            <ItemAccount
              title="Name"
              name="name"
              value={currentUser?.name || ""}
              description="Your name will be displayed on your profile"
              onSave={(name, value) => mutationSave.mutate({ name, value })}
            />
            <ItemAccount
              title="Email"
              name="email"
              value={currentUser?.email || ""}
              description="Your email address will be used to log in"
              onSave={(name, value) => mutationSave.mutate({ name, value })}
            />
            <ItemAccount
              title={"Gender"}
              description={""}
              name="gender"
              radio={true}
              value={"Female"}
              onSave={(name: string, value: string) =>
                mutationSave.mutate({ name, value })
              }
              option={[
                { id: "1", title: "Female" },
                { id: "2", title: "Male" },
                { id: "3", title: "No disclosure" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

const ItemAccount = ({
  title,
  name,
  date = false,
  radio = false,
  option = [],
  value: valueDefault,
  description,
  onSave,
}: {
  title: string;
  name: string;
  date?: boolean;
  radio?: boolean;
  value: string;
  option?: Array<{ id: string; title: string }>;
  description?: string;
  onSave: (name: string, value: string) => void;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(valueDefault);
  const [error, setError] = useState("");

  const handleOpenEdit = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Focus vào thẻ input khi bắt đầu chỉnh sửa
      }
    }, 0);
  };

  const handleClickSave = () => {
    // if (error) return toast.error(error);
    onSave(name, value);
    setIsEdit(false);
    setError("");
  };

  const handleChangeValue = (value: string) => {
    setValue(value);
    if (name === "name" && value.length < 6) {
      // setError(t("notify.errorNameLength6Char"));
    } else {
      setError("");
    }
  };

  const handleClickCancel = () => {
    setIsEdit(false);
    setError("");
    setValue(valueDefault);
  };

  return (
    <div className={styles.Account_item}>
      <h6 className={styles.title}>{title}</h6>
      <p className={styles.desc}>{description}</p>
      <div
        className={`${styles.Account_item_body} ${isFocus ? "focus" : ""} ${
          error ? "error" : ""
        }`}
      >
        <div
          className={`${styles.Account_item_body_desc} ${
            isEdit ? styles.edit : ""
          }`}
        >
          <span>{valueDefault}</span>
          {!radio ? (
            <input
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              ref={inputRef}
              value={value}
              type={date ? "date" : "text"}
              onChange={(e) => handleChangeValue(e.target.value)}
              defaultValue={value}
              placeholder="Enter your name..."
            />
          ) : (
            <div className={styles.Account_radio}>
              {option.map((item, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={name}
                    value={item.title}
                    defaultChecked={item.title === value}
                    checked={value === item.title}
                    onChange={(e) => handleChangeValue(e.target.value)}
                  />
                  <span>{item.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className={styles.Account_item_body_buttons}>
          {!isEdit ? (
            <button onClick={() => handleOpenEdit()} className={styles.btnEdit}>
              <i className="fa-solid fa-pen"></i>
            </button>
          ) : (
            !date &&
            !radio && (
              <button
                className="btn-clear"
                onClick={() => {
                  setValue("");
                  handleOpenEdit();
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )
          )}
        </div>
      </div>
      <div className={styles.Account_item_bottom}>
        {isEdit && (
          <div className={styles.Account_item_bottom_buttons}>
            <button onClick={handleClickCancel}>Cancel</button>
            <button onClick={handleClickSave}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};
