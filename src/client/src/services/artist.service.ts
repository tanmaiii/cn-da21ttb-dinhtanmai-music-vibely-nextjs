import createHttpClient from "@/lib/createHttpClient";
import { IArtist } from "@/types";
import { ListResponse, ResponseAPI } from "@/types/common.type";
import { QueryParams } from "../types/common.type";

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
    const res = await (
      await this.client
    ).get<ResponseAPI<IArtist>>(`/${slug}/slug`);
    return res.data;
  }
}

const artistService = new ArtistService();
export default artistService;
