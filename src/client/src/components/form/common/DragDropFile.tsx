import { formatFileSize, formatImg } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ButtonIconRound } from "@/components/ui/Button";
import styles from "./style.module.scss";

interface Props {
  name: string;
  accept: string;
  label?: string;
  error?: string;
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
    error,
    label = "Drop here to upload",
  } = porps;
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [imageDefault, setImageDefault] = useState<string | null>(null);
  const [fileDefault, setFileDefault] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      setFileDefault(file);
    }else{
      setFileDefault(null)
    }
  }, [file]);

  useEffect(() => {
    if (image_default) {
      setImageDefault(image_default);
    }
  }, [image_default]);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    onChange(e);
    setOpenDrop(false);
  };

  const onRemove = () => {
    onChange({
      target: { files: null },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    setImageDefault(null);
  };

  return (
    <>
      <div
        className={`${styles.DragDropFile} `}
        onDragEnter={() => setOpenDrop(true)}
      >
        <div className={`${styles.DragDropFile_swapper} ${className}`}>
          {((fileDefault && image) || imageDefault) && (
            <>
              <ButtonIconRound
                size="small"
                dataTooltip="Remove file"
                onClick={onRemove}
                className={styles.btn_remove}
                icon={<i className="fa-solid fa-trash"></i>}
              />
              <Image
                src={
                  fileDefault
                    ? URL.createObjectURL(fileDefault)
                    : formatImg(imageDefault ?? "") || ""
                }
                width={400}
                height={400}
                alt=""
              />
            </>
          )}

          <label
            htmlFor={`upload-${name}`}
            className={`${styles.default} ${
              ((fileDefault && image) || imageDefault) && styles.hidden
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

        {!image && fileDefault && (
          <div className={styles.DragDropFile_file}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <div>
                <h6>{fileDefault.name}</h6>
                <span>{formatFileSize(fileDefault.size)}</span>
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

        {error && (
          <span className={`${styles.DragDropFile_error}`}>{error}</span>
        )}
      </div>
    </>
  );
};

export default DragDropFile;
