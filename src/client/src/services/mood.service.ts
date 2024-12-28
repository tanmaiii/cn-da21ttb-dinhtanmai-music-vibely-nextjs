import createHttpClient from "@/lib/createHttpClient";
import { IGenre, ResponseAPI } from "@/types";

class MoodService {
  private client;

  constructor() {
    this.client = createHttpClient("api/mood");
  }

  async getAll(): Promise<ResponseAPI<IGenre[]>> {
    const res = await this.client.get<ResponseAPI<IGenre[]>>("");
    return res.data;
  }
}

const moodService = new MoodService();

export default moodService;
