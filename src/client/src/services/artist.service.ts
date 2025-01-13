import createHttpClient from "@/lib/createHttpClient";
import { IArtist, IPlaylist, ISong } from "@/types";
import { ListResponse, ResponseAPI } from "@/types/common.type";
import { QueryParams } from "../types/common.type";
import { QuerySongParams } from "@/types/song.type";

class ArtistService {
  private client;

  constructor() {
    this.client = createHttpClient("api/artist");
  }

  async getAll(
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IArtist>>> {
    const res = await (
      await this.client
    ).get<ResponseAPI<ListResponse<IArtist>>>("", { params });
    return res.data;
  }

  async getBySlug(slug: string): Promise<ResponseAPI<IArtist>> {
    const res = await this.client.get<ResponseAPI<IArtist>>(`/${slug}/slug`);
    return res.data;
  }

  async checkFollow(id: string): Promise<ResponseAPI<boolean>> {
    const res = await this.client.get<ResponseAPI<boolean>>(`${id}/follow`);
    return res.data;
  }

  async follow(id: string): Promise<ResponseAPI<null>> {
    const res = await this.client.post<ResponseAPI<null>>(`${id}/follow`);
    return res.data;
  }

  async unFollow(id: string): Promise<ResponseAPI<null>> {
    const res = await this.client.delete<ResponseAPI<null>>(`${id}/follow`);
    return res.data;
  }

  async getSongs(id: string, params: QuerySongParams): Promise<ResponseAPI<ListResponse<ISong>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<ISong>>>(`/${id}/song`, {params});
    return res.data;
  }

  async getPlaylists(id: string, params: QueryParams): Promise<ResponseAPI<ListResponse<IPlaylist>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IPlaylist>>>(`/${id}/playlist`, {params});
    return res.data;
  }
}

const artistService = new ArtistService();
export default artistService;
