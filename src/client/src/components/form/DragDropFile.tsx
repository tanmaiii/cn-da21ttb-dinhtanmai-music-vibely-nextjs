import Image from "next/image";
import React, { useState } from "react";
import { ButtonIconRound } from "../ui/Button";
import styles from "./style.module.scss";
import formatFileSize from "@/lib/utils";

interface Props {
  name: string;
  accept: string;
  label?: string;
  file: File | null;
  onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
  image?: boolean;
  image_default?: string;
  className?: string;
}

const DragDropFile = (porps: Props) => {
  const {
    name,
    file,
    onChange,
    className,
    image = false,
    image_default,
    accept,
    label = "Drop here to upload",
  } = porps;
  const [openDrop, setOpenDrop] = useState<boolean>(false);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    onChange(e);
    setOpenDrop(false);
  };

  const onRemove = () => {
    onChange({
      target: { files: null },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <div
        className={`${styles.DragDropFile} `}
        onDragEnter={() => setOpenDrop(true)}
      >
        <div className={`${styles.DragDropFile_swapper} ${className}`}>
          {((file && image) || image_default) && (
            <>
              <ButtonIconRound
                size="small"
                dataTooltip="Remove file"
                onClick={onRemove}
                className={styles.btn_remove}
                icon={<i className="fa-solid fa-trash"></i>}
              />
              <Image
                src={file ? URL.createObjectURL(file) : image_default || ""}
                width={400}
                height={400}
                alt=""
              />
            </>
          )}

          <label
            htmlFor={`upload-${name}`}
            className={`${styles.default} ${
              ((file && image) || image_default) && styles.hidden
            } ${openDrop && styles.open}`}
          >
            <i className="fa-light fa-cloud-arrow-up"></i>
            <span>{label}</span>
            <input
              onDragLeave={() => setOpenDrop(false)}
              id={`upload-${name}`}
              onChange={onChangeImage}
              type="file"
              accept={accept}
              // hidden
            />
          </label>
        </div>

        {!image && file && (
          <div className={styles.DragDropFile_file}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <div>
                <h6>{file.name}</h6>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
            <div className={styles.right}>
              <ButtonIconRound
                size="small"
                dataTooltip="Remove file"
                onClick={onRemove}
                icon={<i className="fa-solid fa-xmark"></i>}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DragDropFile;
