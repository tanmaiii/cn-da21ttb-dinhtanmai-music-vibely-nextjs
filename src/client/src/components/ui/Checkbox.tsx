import React from "react";
import styles from "./style.module.scss";

interface Props {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = (props: Props) => {
  const { name, value, checked, onChange } = props;
  return (
    <div className={styles.Checkbox}>
      <label htmlFor={value} key={value}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          id={value}
          name={name}
          value={value}
        />
        {checked && <i className="fa-solid fa-check"></i>}
      </label>
    </div>
  );
};

export default Checkbox;
