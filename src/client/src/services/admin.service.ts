import createHttpClient from "@/lib/createHttpClient";
import { IGenre } from "@/types";
import { ResponseAPI } from "@/types/common.type";

interface GenreN extends IGenre {
  numberOfSongs: number;
}

class AdminService {
  private client;

  constructor() {
    this.client = createHttpClient("api/admin");
  }

  async getPlaying(): Promise<ResponseAPI<Record<string, number>>> {
    return this.client.get("/playing");
  }

  async getCreateSong(): Promise<ResponseAPI<Record<string, number>>> {
    return this.client.get("/create-song");
  }

  async getGenre(): Promise<ResponseAPI<GenreN[]>> {
    const res = await this.client.get("/genre-numbers");
    return res.data;
  }
}

export default new AdminService() as AdminService;
