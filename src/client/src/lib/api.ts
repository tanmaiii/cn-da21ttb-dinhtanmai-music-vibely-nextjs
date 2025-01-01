const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const apiConfig = {
  baseUrl: `${baseURL}`,
  imageURL: (imgPath: string) => `${baseURL}/image/${imgPath}`,
  audioURL: (mp3Path: string) => `${baseURL}/audio/${mp3Path}`,
};

export default apiConfig;