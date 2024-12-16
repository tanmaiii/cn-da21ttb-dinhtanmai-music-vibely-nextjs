import React, { useEffect } from "react";
import styles from "./style.module.scss";
import { ButtonIcon, ButtonIconPrimary } from "../ui/Button";
import EmojiPicker from "./EmojiPicker";

interface InputProps {
  onSubmit: (message: string) => void;
}

const Input = (props: InputProps) => {
  const { onSubmit } = props;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const innitHeight = 40;
  const [keyword, setKeyword] = React.useState<string>("");
  const [showEmoji, setShowEmoji] = React.useState<boolean>(false);

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = `${innitHeight}px`;
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeyword(e.target.value);
    if (e.target.value === "") {
      inputRef.current!.style.height = `${innitHeight}px`;
    }
    if (e.target.value.includes("\n")) {
      handleSubmit();
    }
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  function handleEmojiClick(emoji: string) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setKeyword(
        keyword.substring(0, selectionStart) +
          emoji +
          keyword.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const handleSubmit = () => {
    if (!keyword.trim()) return;
    onSubmit(keyword);
    setKeyword("");
    if (showEmoji) setShowEmoji(false);
    if (inputRef.current) {
      inputRef.current.style.height = `${innitHeight}px`;
    }
  };

  return (
    <div ref={chatRef} className={`${styles.Input}`}>
      <div className={`${styles.Input_icons}`}>
        <ButtonIcon
          onClick={() => setShowEmoji(!showEmoji)}
          size="small"
          icon={<i className="fa-regular fa-face-smile"></i>}
        />
      </div>
      <div className={`${styles.Input_chat}`}>
        <textarea
          onChange={handleChangeInput}
          onInput={handleInput}
          ref={inputRef}
          value={keyword}
          placeholder="Enter your message ..."
        ></textarea>
      </div>
      <div className={`${styles.Input_send}`}>
        <ButtonIconPrimary
          onClick={handleSubmit}
          size="small"
          icon={<i className="fa-solid fa-paper-plane"></i>}
        />
      </div>
      {showEmoji && (
        <div className={`${styles.Input_emoji}`}>
          <EmojiPicker onSelect={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default Input;
