"use client";
import { ButtonLabel } from "@/components/ui/Button";
import React, { useState } from "react";
import styles from "./style.module.scss";

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
        {false ? (
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
          // <div className={`${styles.UploadPage_body_header}`}>
          //   <button
          //     className={`${styles.UploadPage_body_header_item} ${
          //       step === 1 && styles.UploadPage_body_header_item_active
          //     }`}
          //     onClick={() => setStep(1)}
          //   >
          //     <div
          //       className={`${styles.UploadPage_body_header_item_swapper}`}
          //     >
          //       <h4>Detail</h4>
          //       <div
          //         className={`${styles.UploadPage_body_header_item_swapper_icon}`}
          //       ></div>
          //     </div>
          //     <div
          //       className={`${styles.UploadPage_body_header_item_line}`}
          //     ></div>
          //   </button>
          //   <button
          //     className={`${styles.UploadPage_body_header_item} ${
          //       step === 2 && styles.UploadPage_body_header_item_active
          //     }`}
          //     onClick={() => setStep(2)}
          //   >
          //     <div
          //       className={`${styles.UploadPage_body_header_item_swapper}`}
          //     >
          //       <h4>Lyrics</h4>
          //       <div
          //         className={`${styles.UploadPage_body_header_item_swapper_icon}`}
          //       ></div>
          //     </div>
          //     {/* <div className={`${styles.UploadPage_body_header_item_line}`}></div> */}
          //   </button>
          // </div>
          // <FormCreateSong />
          <div>Xin chao</div>

          // step == 1 ? (
          //   <FormCreateSong />
          // ) : (
          //   <FormCreateLyrics />
        )}
      </div>
    </div>
  );
};

export default UploadPage;
