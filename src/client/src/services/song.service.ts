import createHttpClient from "@/lib/createHttpClient";
import { ISong, ListResponse, ResponseAPI } from "@/types";

class SongService {
  private client;

  constructor() {
    this.client = createHttpClient("api/song");
  }

  async getAllSong(): Promise<ResponseAPI<ListResponse<ISong>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<ISong>>>("/");
    return res.data;
  }

  async getSongById(id: string) {
    return await this.client.get(`/song/${id}`);
  }
}

const songService = new SongService();
export default songService;
