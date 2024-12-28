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

  async getBySlug(slug: string): Promise<ResponseAPI<ISong>> {
    const res = await this.client.get<ResponseAPI<ISong>>(`/${slug}/slug`);
    return res.data;
  }

  async getAllSongLiked(): Promise<ResponseAPI<ISong[]>> {
    const res = await this.client.get<ResponseAPI<ISong[]>>("/like");
    return res.data;
  }
}

const songService = new SongService();
export default songService;
