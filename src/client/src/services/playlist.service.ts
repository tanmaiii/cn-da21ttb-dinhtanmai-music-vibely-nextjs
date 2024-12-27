import createHttpClient from "@/lib/createHttpClient";
import { IPlaylist, ISong, PlaylistRequestDto } from "@/types";
import { ListResponse, ResponseAPI } from "@/types/common.type";
import { QueryParams } from "../types/common.type";
import { PlaylistLikeQueryParamsDto } from "@/types/playlist.type";

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

  async getMe(
    params: PlaylistLikeQueryParamsDto
  ): Promise<ResponseAPI<ListResponse<IPlaylist>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IPlaylist>>>(
      "/like",
      { params }
    );
    return res.data;
  }

  async getBySlug(slug: string): Promise<ResponseAPI<IPlaylist>> {
    const res = await this.client.get<ResponseAPI<IPlaylist>>(`/${slug}/slug`);
    return res.data;
  }

  async create(
    data: Partial<PlaylistRequestDto>
  ): Promise<ResponseAPI<IPlaylist>> {
    const res = await this.client.post<ResponseAPI<IPlaylist>>("", data);
    return res.data;
  }

  async update(id: string, data: Partial<PlaylistRequestDto>) {
    const res = await this.client.put(`/${id}`, data);
    return res.data;
  }

  async getAllSongs(id: string): Promise<ResponseAPI<ISong[]>> {
    const res = await this.client.get<ResponseAPI<ISong[]>>(`/${id}/song`);
    return res.data;
  }

  async updateSongs(id: string, songId: string[]) {
    await this.client.put(id, { songId });
  }
}

const playlistService = new PlaylistService();
export default playlistService;
