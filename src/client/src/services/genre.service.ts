import createHttpClient from "@/lib/createHttpClient";
import { IGenre, ResponseAPI } from "@/types";

class GenreService {
  private client;

  constructor() {
    this.client = createHttpClient("api/genre");
  }

  async getAll(): Promise<ResponseAPI<IGenre[]>> {
    const res = await (await this.client).get<ResponseAPI<IGenre[]>>("");
    return res.data;
  }
}

export default new GenreService() as GenreService;
