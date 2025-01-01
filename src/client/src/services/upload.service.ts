import createHttpClient from "@/lib/createHttpClient";
import { ResponseAPI } from "@/types";

interface UploadResponseDto {
  path: string;
  name: string;
}

class UploadService {
  private client;

  constructor() {
    this.client = createHttpClient("api/upload");
  }

  async upload(data: FormData): Promise<ResponseAPI<UploadResponseDto>> {
    const res = await this.client.post<ResponseAPI<UploadResponseDto>>(
      "/",
      data,
      {
        headers: { Accept: "application/form-data" },
      }
    );
    return res.data;
  }

  async getAudioFile(filename: string): Promise<Blob> {
    const res = await this.client.get(`/audio/${filename}`, {
      responseType: "blob",
    });
    return res.data;
  }
}

export default new UploadService() as UploadService;
