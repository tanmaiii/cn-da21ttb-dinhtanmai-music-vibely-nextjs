import React from "react";
import styles from "./style.module.scss";

export interface IOptionSelect {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  name: string;
  desc?: string;
  error?: string;
  className?: string;
  options: IOptionSelect[];
  values?: string[];
  onChange: (_: string[]) => void;
}

const MultipleSelect = (props: Props) => {
  const { label, desc, error, className, name, options, values, onChange } =
    props;
  const MultipleSelectRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        MultipleSelectRef.current &&
        !MultipleSelectRef.current.contains(e.target as Node)
      ) {
        setActive(false);
        setKeyword("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    if (values && values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange(values ? [...values, value] : [value]);
    }
    setActive(false);
    setKeyword("");
  };

  return (
    <div className={`${styles.MultipleSelect} ${className}`}>
      <div ref={MultipleSelectRef} className={`${styles.MultipleSelect_box}`}>
        <div className={`${styles.MultipleSelect_box_header}`}>
          <input
            type="text"
            name={name}
            autoComplete="off"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder=" "
            onClick={() => setActive(!active)}
          />
          <label>{label}</label>
          <i className="fa-regular fa-chevron-down"></i>
        </div>
        {active && (
          <ul className={`${styles.MultipleSelect_box_select}`}>
            {options &&
              options
                .filter((option) =>
                  option.label.toLowerCase().includes(keyword.toLowerCase())
                )
                .map((option: IOptionSelect) => (
                  <li
                    onClick={() => handleChange(option.value)}
                    key={option.value}
                    value={option.value}
                    className={
                      values && values.includes(option.value) ? styles.active : undefined
                    }
                  >
                    <span>{option.label}</span>
                  </li>
                ))}
          </ul>
        )}
      </div>

      {desc && <span className={`${styles.MultipleSelect_desc}`}>{desc}</span>}

      <div className={styles.MultipleSelect_selected}>
        {values &&
          values.map((value) => {
            const item = options.find((option) => option.value === value);
            return (
              item && (
                <div key={item.value} className={`${styles.item}`}>
                  <span>{item.label}</span>
                  <i
                    onClick={() => onChange(values.filter((i) => i !== value))}
                    className="fa-solid fa-times"
                  ></i>
                </div>
              )
            );
          })}
      </div>

      {error && (
        <span className={`${styles.MultipleSelect_error}`}>{error}</span>
      )}
    </div>
  );
};

export default MultipleSelect;
