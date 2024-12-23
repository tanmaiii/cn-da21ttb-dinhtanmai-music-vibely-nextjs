import createHttpClient from "@/lib/createHttpClient";
import { IPlaylist } from "@/types";
import { ListResponse, ResponseAPI } from "@/types/common.type";
import { QueryParams } from "../types/common.type";

class PlaylistService {
  private client;

  constructor() {
    this.client = createHttpClient("api/playlist");
  }

  async getAll(
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IPlaylist>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IPlaylist>>>(
      "",
      { params }
    );
    return res.data;
  }

  async getBySlug(slug: string): Promise<ResponseAPI<IPlaylist>> {
    const res = await this.client.get<ResponseAPI<IPlaylist>>(`/${slug}/slug`);
    return res.data;
  }
}

const playlistService = new PlaylistService();
export default playlistService;
