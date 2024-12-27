import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";

interface Props {
  label: string;
  desc?: string;
  name: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange: (_: string) => void;
}

const Radio = ({ name, label, desc, options, value, onChange }: Props) => {
  const [valueDefault, setValueDefault] = useState(value);

  const handleChange = (value: string) => {
    onChange(value);
  };

  useEffect(() => {
    if (value) setValueDefault(value);
  }, [value]);

  return (
    <div className={`${styles.Radio}`}>
      <label className={`${styles.Radio_label}`} htmlFor={name}>
        {label}
      </label>
      {desc && <span className={`${styles.Radio_desc}`}>{desc}</span>}
      <div className={`${styles.Radio_body}`}>
        {options &&
          options?.map(
            (option: {
              value: string;
              label: string;
              description?: string;
            }) => (
              <label
                htmlFor={option.value}
                key={option.value}
                className={`${styles.Radio_body_item}`}
              >
                <input
                  type="radio"
                  id={option.value}
                  name={name}
                  defaultChecked={valueDefault === option.value}
                  value={option.value}
                  onChange={() => handleChange(option.value)}
                />
                <div className={`${styles.Radio_body_item_title}`}>
                  <span>{option.label}</span>
                  {option?.description && <p>{option.description}</p>}
                </div>
              </label>
            )
          )}
      </div>
    </div>
  );
};

export default Radio;
