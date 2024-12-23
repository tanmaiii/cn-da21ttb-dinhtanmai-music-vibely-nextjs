import createHttpClient from "@/lib/createHttpClient";
import { ISong, ListResponse, QueryParams, ResponseAPI } from "@/types";

class SongService {
  private client;

  constructor() {
    this.client = createHttpClient("api/song");
  }

  async getAllSong(
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<ISong>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<ISong>>>("", {
      params,
    });
    return res.data;
  }

  async getSongById(id: string) {
    return await this.client.get(`/song/${id}`);
  }
}

const songService = new SongService();
export default songService;
