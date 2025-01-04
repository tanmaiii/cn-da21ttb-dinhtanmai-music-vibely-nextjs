import React, { useEffect } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
}

const Input = (props: InputProps) => {
  const {
    type = "text",
    placeholder = "",
    value = "",
    onSubmit,
    onChange,
  } = props;
  const [keyword, setKeyword] = React.useState<string>(value);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setKeyword(value);
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (!onSubmit) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSubmit(value);
    }, 500);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={keyword || ""}
      onInput={onChangeInput}
      onChange={onChange}
    />
  );
};

export default Input;
