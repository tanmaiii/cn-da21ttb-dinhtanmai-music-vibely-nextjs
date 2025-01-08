import createHttpClient from "@/lib/createHttpClient";
import { IMood, ListResponse, ResponseAPI } from "@/types";
import { MoodRequestDto } from "@/types/mood.type";


interface QueryParamsMood {
  limit?: number;
  page?: number;
  keyword?: string;
}

class MoodService {
  private client;

  constructor() {
    this.client = createHttpClient("api/mood");
  }

  async getAll(params: QueryParamsMood): Promise<ResponseAPI<ListResponse<IMood>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IMood>>>("", {params});
    return res.data;
  }

  async create(data: Partial<MoodRequestDto>): Promise<ResponseAPI<IMood>> {
    const res = await this.client.post<ResponseAPI<IMood>>("", data);
    return res.data;
  }

  async update(id: string, data: Partial<IMood>): Promise<ResponseAPI<IMood>> {
    const res = await this.client.put<ResponseAPI<IMood>>(`/${id}`, data);
    return res.data;
  }

  async delete(id: string) {
    await this.client.delete(`/${id}`);
  }
}

export default new MoodService() as MoodService;
