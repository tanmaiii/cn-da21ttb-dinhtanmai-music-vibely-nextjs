"use client";

import React from "react";
import styles from "./style.module.scss";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
  name: string;
  label?: string;
  error?: string;
}

const FormItem = (props: Props) => {
  const [keyword, setKeyword] = React.useState<string>("");
  const [type, setType] = React.useState<string>(props.type);

  const habdleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  return (
    <div className={`${styles.FormItem}`}>
      {props.label && <label htmlFor={props.name}>{props.label}</label>} 
      <div
        className={`${styles.FormItem_input} ${
          props.error && styles.FormItem_input_error
        }`}
      >
        <input
          type={type}
          placeholder={props.placeholder}
          name={props.name}
          value={keyword}
          onChange={habdleChange}
          autoComplete="off"
        />
        {props.type === "password" && (
          <button
            className={`${styles.FormItem_input_eye}`}
            onClick={() =>
              setType(() => (type === "password" ? "text" : "password"))
            }
          >
            {type === "password" ? (
              <i className="fa-light fa-eye"></i>
            ) : (
              <i className="fa-light fa-eye-slash"></i>
            )}
          </button>
        )}
      </div>
      {props.error && (
        <span className={`${styles.FormItem_error}`}>{props.error}</span>
      )}
    </div>
  );
};

export default FormItem;
