"use client";
import React from "react";
import { ButtonLabel } from "../ui/Button";
import styles from "./style.module.scss";

const LyricItem = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos."
  );
  return (
    <div className={`${styles.FormCreateLyrics_body_list_item}`}>
      <button className={`${styles.FormCreateLyrics_body_list_item_remove}`}>
        <i className="fa-solid fa-circle-minus"></i>
      </button>
      <div className={`${styles.FormCreateLyrics_body_list_item_time}`}>
        00:12
      </div>
      <div className={`${styles.FormCreateLyrics_body_list_item_content}`}>
        {open ? (
          <input
            placeholder="Enter lyrics"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <span>{value}</span>
        )}

        <button
          className={`${open ? styles.open : ""}`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <i className="fa-regular fa-check"></i>
          ) : (
            <i className="fa-light fa-pen"></i>
          )}
        </button>
      </div>
    </div>
  );
};

const FormCreateLyrics = () => {
  return (
    <div className={`${styles.FormCreateLyrics}`}>
      <div className={`${styles.FormCreateLyrics_header}`}>
        <div className={`${styles.FormCreateLyrics_header_left}`}>
          <h3>Create Lyrics</h3>
          <p>Write the lyrics of your song</p>
        </div>
        <ButtonLabel size="small">
          <label htmlFor="file-lyric">Upload</label>
        </ButtonLabel>
        <input hidden type="file" id="file-lyric" />
      </div>
      <div className={`${styles.FormCreateLyrics_body}`}>
        <div className={`${styles.FormCreateLyrics_body_list}`}>
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <LyricItem />
          <div className={`${styles.FormCreateLyrics_body_list_add}`}>
            <button>
              <i className="fa-solid fa-circle-plus"></i>
            </button>
            <div className={`${styles.FormCreateLyrics_body_list_add_time}`}>
              00:12
            </div>
            <span>Add Lyrics</span>
          </div>
        </div>
      </div>
      <div className={`${styles.FormCreateLyrics_footer}`}>
        <ButtonLabel
          line
          className={`${styles.FormCreateLyrics_footer_btnCancel}`}
        >
          <label>Back</label>
        </ButtonLabel>

        <ButtonLabel className={`${styles.FormCreateLyrics_footer_btnCreate}`}>
          <label>Create</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default FormCreateLyrics;
