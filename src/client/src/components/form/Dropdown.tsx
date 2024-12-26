import React from "react";
import styles from "./style.module.scss";

export interface IOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  name: string;
  desc?: string;
  error?: string;
  className?: string;
  options: IOption[];
  value?: string;
  onChange: (_: IOption) => void;
}

const Dropdown = (props: Props) => {
  const { label, desc, error, value, className, name, options, onChange } =
    props;
  const [active, setActive] = React.useState(false);
  const DropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        DropdownRef.current &&
        !DropdownRef.current.contains(e.target as Node)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: IOption) => {
    onChange(value);
    setActive(false);
  };

  return (
    <div className={`${styles.Dropdown} ${className}`}>
      <div ref={DropdownRef} className={`${styles.Dropdown_box}`}>
        <div className={`${styles.Dropdown_box_header}`}>
          <input
            type="text"
            name={name}
            value={options.find((o) => o.value === value)?.label}
            readOnly
            placeholder=" "
            onClick={() => setActive(!active)}
          />
          <label>{label}</label>
          <i className="fa-regular fa-chevron-down"></i>
        </div>
        {active && (
          <ul className={`${styles.Dropdown_box_select}`}>
            {options &&
              options?.map((option: IOption) => (
                <li
                  onClick={() => handleChange(option)}
                  key={option.value}
                  value={option.value}
                >
                  <span>{option.label}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
      {desc && <span className={`${styles.Dropdown_desc}`}>{desc}</span>}

      {error && <span className={`${styles.Dropdown_error}`}>{error}</span>}
    </div>
  );
};

export default Dropdown;
