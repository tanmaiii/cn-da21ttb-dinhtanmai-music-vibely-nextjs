function getFilePath(
  files: { [fieldname: string]: Express.Multer.File[] },
  field: string
): string {
  return files?.[field]?.[0]?.filename || "";
}

function formatStringToSlug(str: string): string {
  const accentsMap: { [key: string]: string } = {
    àáạảãâầấậẩẫăằắặẳẵ: "a",
    èéẹẻẽêềếệểễ: "e",
    ìíịỉĩ: "i",
    òóọỏõôồốộổỗơờớợởỡ: "o",
    ùúụủũưừứựửữ: "u",
    ỳýỵỷỹ: "y",
    đ: "d",
    ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ: "A",
    ÈÉẸẺẼÊỀẾỆỂỄ: "E",
    ÌÍỊỈĨ: "I",
    ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ: "O",
    ÙÚỤỦŨƯỪỨỰỬỮ: "U",
    ỲÝỴỶỸ: "Y",
    Đ: "D",
  };

  // Thay thế các ký tự có dấu bằng ký tự không dấu
  for (const pattern in accentsMap) {
    const regex = new RegExp("[" + pattern + "]", "g");
    str = str.replace(regex, accentsMap[pattern]);
  }

  // Chuyển chuỗi về dạng chữ thường
  return str.toLowerCase();
}

type SortOptions =
  | "newest"
  | "oldest"
  | "mostLikes"
  | "mostListens"
  | "mostFollows";

export { formatStringToSlug, getFilePath, SortOptions };

