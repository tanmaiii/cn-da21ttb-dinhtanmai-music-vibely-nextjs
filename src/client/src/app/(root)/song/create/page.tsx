"use client";
import { FormCreateSong } from "@/components/Form";
import { ButtonLabel } from "@/components/ui/Button";
import { usePlayer } from "@/context/PlayerContext";
import { useCustomToast } from "@/hooks/useToast";
import { paths, PERMISSIONS } from "@/lib/constants";
import { RootState } from "@/lib/store";
import { hasPermission, validateFile } from "@/lib/utils";
import songService from "@/services/song.service";
import { SongRequestDto } from "@/types/song.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import Modal, { ModalConfirm } from "@/components/Modal";

const UploadPage = () => {
  const { toastSuccess, toastError } = useCustomToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [isExit, setIsExit] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { stop } = usePlayer();

  const onDragEnter = () => {
    setOpenDrop(true);
  };

  const onDragLeave = () => {
    setOpenDrop(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { file, error } = validateFile(e, 12 * 1024 * 1024, ["audio/mpeg"]);
    setOpenDrop(false);

    if (!file) {
      setError("Please upload a valid audio file");
    }

    if (error) {
      setError(error);
      return;
    }

    if (file) {
      setFile(file);
      stop();
    }
  };

  const mutationAdd = useMutation({
    mutationFn: async (data: SongRequestDto) => {
      const res = await songService.create(data);
      return res;
    },
    onSuccess: (data) => {
      toastSuccess("Create song success");
      queryClient.invalidateQueries({ queryKey: ["song"] });
      if (data.data.slug) {
        router.push(paths.SONG + "/" + data.data.slug);
      } else {
        router.push(paths.HOME);
      }
    },
    onError: (error) => {
      toastError(error.message);
      router.push(paths.HOME);
    },
  });

  if (!hasPermission(currentUser?.role.permissions, PERMISSIONS.CREATE_SONGS)) {
    router.push(paths.HOME);
  }

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
            onClose={() => setIsExit(true)}
            file={file}
            onSubmit={(data) => mutationAdd.mutate(data)}
          />
        )}
      </div>

      <ModalConfirm
        show={isExit ? true : false}
        onClose={() => setIsExit(false)}
        title="Are you sure you want to leave?"
        content="If you leave this page, your upload will be canceled."
        onConfirm={() => {
          setFile(null);
          setIsExit(false);
        }}
      />
    </div>
  );
};

export default UploadPage;
