import React from "react";
import styles from "./style.module.scss";

interface Props {
  path?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  hide?: boolean;
  onClick?: () => void;
  dataTooltip?: string;
  white?: boolean;
  type?: "button" | "submit" | "reset";
  // disable?: boolean;
}

const ButtonIconPrimary = (props: Props) => {
  return (
    <button
      data-tooltip={props.dataTooltip}
      disabled={props.hide}
      style={props.style}
      className={`${props.className}  ${styles.Button} ${
        styles.Button_IconPrimary
      } ${styles[props.size || "medium"]}`}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
};

const ButtonIcon = (props: Props) => {
  return (
    <button
      data-tooltip={props.dataTooltip}
      disabled={props.hide}
      style={props.style}
      className={`${props.className} ${styles.Button} ${styles.Button_Icon} ${
        styles[props.size || "medium"]
      }`}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
};

const ButtonIconRound = (props: Props) => {
  return (
    <button
      data-tooltip={props.dataTooltip}
      disabled={props.hide}
      style={props.style}
      className={`${props.className}  ${styles.Button} ${
        styles.Button_IconRound
      } ${styles[props.size || "medium"]}`}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
};

const ButtonIconSquare = (props: Props) => {
  return (
    <button
      data-tooltip={props.dataTooltip}
      disabled={props.hide}
      style={props.style}
      className={`${props.className}  ${styles.Button} ${
        styles.Button_IconSquare
      } ${styles[props.size || "medium"]}`}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
};

interface ButtonLabelProps extends Props {
  children: React.ReactNode;
  line?: boolean;
}

const ButtonLabel = (props: ButtonLabelProps) => {
  return (
    <button
      data-tooltip={props?.dataTooltip}
      disabled={props?.hide}
      style={props?.style}
      className={`${props?.className}  ${styles.Button} ${styles.Button_Label} ${
        props?.line && styles.Button_Label_line
      } ${styles[props?.size || "medium"]}`}
      onClick={props?.onClick}
      type={props?.type}
    >
      {props?.children}
    </button>
  );
};

export {
  ButtonIcon,
  ButtonIconRound,
  ButtonIconPrimary,
  ButtonIconSquare,
  ButtonLabel,
};
