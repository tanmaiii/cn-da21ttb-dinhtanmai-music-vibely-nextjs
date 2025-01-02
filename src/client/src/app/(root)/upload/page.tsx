"use client";
import { ButtonLabel } from "@/components/ui/Button";
import React, { useState } from "react";
import styles from "./style.module.scss";
import { FormCreateSong } from "@/components/Form";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  // const [step, setStep] = useState<1 | 2>(1);

  const onDragEnter = () => {
    setOpenDrop(true);
    console.log(file);
  };

  const onDragLeave = () => {
    setOpenDrop(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setOpenDrop(false);
    setError("");

    if (file && file?.type !== "audio/mpeg") {
      return setError("Please upload a valid audio file");
    }

    if (file && file?.size > 11 * 1024 * 1024) {
      setError("File size is too big");
      return;
    }

    if (file) {
      setFile(file);
    }
  };

  return (
    <div className={`${styles.UploadPage}`}>
      <div
        onDragEnter={onDragEnter}
        className={`${styles.UploadPage_body} ${openDrop ? styles.open : ""}`}
      >
        {!file ? (
          <>
            <div className={`${styles.UploadPage_body_upload}`}>
              <div className={`${styles.UploadPage_body_upload_icon}`}>
                <i className="fa-solid fa-upload"></i>
              </div>
              <h4>Drag and drop audio files to upload</h4>
              <p>Your song will be private until you publish it</p>
              <ButtonLabel>
                <label htmlFor="file-upload">Choose file</label>
                <input
                  hidden
                  className={styles.UploadPage_body_upload_input}
                  onChange={handleUpload}
                  id="file-upload"
                  type="file"
                />
              </ButtonLabel>
            </div>

            {openDrop && (
              <div
                onDragLeave={onDragLeave}
                className={`${styles.UploadPage_body_drag}`}
              >
                <input onChange={handleUpload} id="file-upload" type="file" />
              </div>
            )}

            {error && (
              <div className={`${styles.error}`}>
                <i className="fa-regular fa-triangle-exclamation"></i>
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <FormCreateSong
            file={file}
            onSubmit={(data) => console.log(data)}
          />
        )}
      </div>
    </div>
  );
};

export default UploadPage;
