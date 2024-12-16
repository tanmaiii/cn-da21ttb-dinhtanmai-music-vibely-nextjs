import React from "react";
import styles from "./style.module.scss";

interface Props {
  label?: string;
  name: string;
  desc?: string;
  type: "text" | "password" | "email" | "number" | "textarea" | "select";
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  max?: number;
}

const FormItem = ({
  label,
  desc,
  placeholder = "Enter text...",
  type = "text",
  value,
  onChange,
  required = true,
  error,
  name,
  icon,
  className,
  style,
  disabled,
  max,
}: Props) => {
  return (
    <div className={`${styles.FormItem}`}>
      {label && (
        <label className={`${styles.FormItem_label}`} htmlFor={name}>
          {label}
        </label>
      )}
      {desc && <span className={`${styles.FormItem_desc}`}>{desc}</span>}
      <div
        className={`${styles.FormItem_input} ${
          error && styles.FormItem_input_error
        } ${className}`}
      >
        {type === "textarea" ? (
          <textarea
            style={style}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            name={name}
            disabled={disabled}
            maxLength={max}
            value={value}
          />
        ) : (
          <input
            style={style}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            name={name}
            disabled={disabled}
            maxLength={max}
          />
        )}
        {icon && <div className={`${styles.FormItem_input_icon}`}>{icon}</div>}
        {max && (
          <span>
            {value.length}/{max}
          </span>
        )}
      </div>
      {error && <span className={`${styles.FormItem_error}`}>{error}</span>}
    </div>
  );
};

export default FormItem;