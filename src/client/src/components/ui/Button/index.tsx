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
  ref?: React.RefObject<HTMLButtonElement>;
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
      ref={props.ref}
    >
      {props.icon}
    </button>
  );
};

const ButtonIcon = ({
  dataTooltip,
  hide,
  style,
  className,
  size,
  icon,
  onClick,
  ...props
}: Props) => {
  return (
    <button
      data-tooltip={dataTooltip}
      disabled={hide}
      style={style}
      className={`${className} ${styles.Button} ${styles.Button_Icon} ${
        styles[size || "medium"]
      }`}
      onClick={onClick}
      ref={props.ref}
    >
      {icon}
    </button>
  );
};

const ButtonIconRound = ({
  dataTooltip,
  hide,
  style,
  className,
  size,
  icon,
  onClick,
  ...props
}: Props) => {
  return (
    <button
      data-tooltip={dataTooltip}
      disabled={hide}
      style={style}
      className={`${className}  ${styles.Button} ${styles.Button_IconRound} ${
        styles[size || "medium"]
      }`}
      onClick={onClick}
      ref={props.ref}
    >
      {icon}
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
      className={`${props?.className}  ${styles.Button} ${
        styles.Button_Label
      } ${props?.line && styles.Button_Label_line} ${
        styles[props?.size || "medium"]
      }`}
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
