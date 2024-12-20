"use client";

import React from "react";
import styles from "./style.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChangeValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  label?: string;
  error?: string;
}

const FormItem = ({
  type: defaultType,
  name,
  onChangeValue,
  label,
  error,
  ...rest
}: Props) => {
  const [keyword, setKeyword] = React.useState<string>("");
  const [type, setType] = React.useState<string>(defaultType);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (onChangeValue) {
      onChangeValue(e);
    }
  };

  return (
    <div className={`${styles.FormItem}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <div
        className={`${styles.FormItem_input} ${
          error && styles.FormItem_input_error
        }`}
      >
        <input
          type={type}
          name={name}
          value={keyword}
          onChange={handleChange}
          autoComplete="off"
          {...rest}
        />
        {defaultType === "password" && (
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
      {error && <span className={`${styles.FormItem_error}`}>{error}</span>}
    </div>
  );
};

export default FormItem;
