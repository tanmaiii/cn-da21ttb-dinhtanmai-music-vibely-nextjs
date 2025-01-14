import { IPlaylist, ISong, PlaylistRequestDto } from "@/types";
import { ListResponse, ResponseAPI } from "@/types/common.type";
import { QueryParams } from "../types/common.type";
import {
  PlaylistLikeQueryParamsDto,
  PlaylistRequestUpdateDto,
} from "@/types/playlist.type";
import createHttpClient from "@/lib/createHttpClient";

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
    const res = await (
      await this.client
    ).post<ResponseAPI<IPlaylist>>("", data);
    return res.data;
  }

  async update(id: string, data: Partial<PlaylistRequestUpdateDto>) {
    const res = await this.client.put(`/${id}`, data);
    return res.data;
  }

  async delete(id: string) {
    const res = await this.client.delete(`/${id}`);
    return res.data;
  }

  async getAllSongs(id: string): Promise<ResponseAPI<ISong[]>> {
    const res = await (
      await this.client
    ).get<ResponseAPI<ISong[]>>(`/${id}/song`);
    return res.data;
  }

  async updateSongs(id: string, songIds: string[]) {
    await this.client.put(id, { songIds });
  }

  async checkSongToPlaylist(
    id: string,
    data: { songId: string }
  ): Promise<ResponseAPI<boolean>> {
    const res = await this.client.post<ResponseAPI<boolean>>(
      `/${id}/check-song`, {...data}
    );
    return res.data;
  }

  async addSongToPlaylist(id: string, data: { songIds: string[] }) {
    const res = await this.client.post<ResponseAPI<boolean>>(
      `/${id}/song`, {...data}
    );
    return res.data;
  }

  async removeSongFromPlaylist(id: string, data: { songIds: string[] }) {
    const res = await this.client.delete<ResponseAPI<boolean>>(
      `/${id}/song`, { data }
    );
    return res.data;
  }

  async checkLiked(playlistId: string): Promise<ResponseAPI<boolean>> {
    const res = await this.client.get<ResponseAPI<boolean>>(playlistId + "/like");
    return res.data;
  }

  async likeSong(playlistId: string): Promise<ResponseAPI<null>> {
    const res = await this.client.post<ResponseAPI<null>>(playlistId + "/like");
    return res.data;
  }

  async unLikeSong(playlistId: string): Promise<ResponseAPI<null>> {
    const res = await this.client.delete<ResponseAPI<null>>(playlistId + "/like");
    return res.data;
  }
}

export default new PlaylistService() as PlaylistService;
