import createHttpClient from "@/lib/createHttpClient";
import { ISong, ListResponse, ResponseAPI } from "@/types";
import { ILyric, QuerySongParams, SongRequestDto } from "@/types/song.type";
import { AxiosInstance } from "axios";

class SongService {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient("api/song");
  }

  async create(data: SongRequestDto): Promise<ResponseAPI<ISong>> {
    const res = await this.client.post<ResponseAPI<ISong>>("", data);
    return res.data;
  }

  async update(id: string, data: SongRequestDto): Promise<ResponseAPI<ISong>> {
    const res = await this.client.put<ResponseAPI<ISong>>(`/${id}`, data);
    return res.data;
  }

  async delete(id: string): Promise<ResponseAPI<null>> {
    const res = await this.client.delete<ResponseAPI<null>>(`/${id}`);
    return res.data;
  }

  async getAllSong(
    params: QuerySongParams
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

  async checkLiked(songId: string): Promise<ResponseAPI<boolean>> {
    const res = await this.client.get<ResponseAPI<boolean>>(songId + "/like");
    return res.data;
  }

  async likeSong(songId: string): Promise<ResponseAPI<null>> {
    const res = await this.client.post<ResponseAPI<null>>(songId + "/like");
    return res.data;
  }

  async unLikeSong(songId: string): Promise<ResponseAPI<null>> {
    const res = await this.client.delete<ResponseAPI<null>>(songId + "/like");
    return res.data;
  }

  async getLyic(songId: string): Promise<ResponseAPI<ILyric[]>> {
    const res = await this.client.get<ResponseAPI<ILyric[]>>(songId + "/lyric");
    return res.data;
  }

  async playSong(songId: string): Promise<ResponseAPI<null>> {
    const res = await this.client.post<ResponseAPI<null>>(songId + "/play");
    return res.data;
  }
}

export default new SongService() as SongService;
