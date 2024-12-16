"use client";
import { useUI } from "@/context/UIContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
  const { theme } = useUI();

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <Picker
      autoFocus
      theme={theme}
      data={data}
      showPreview={false}
      showSkinTones={false}
      emojiSize={24}
      onEmojiSelect={(emoji: { native: string }) => {
        handleSelect(emoji.native);
      }}
    />
  );
};

export default EmojiPicker;
