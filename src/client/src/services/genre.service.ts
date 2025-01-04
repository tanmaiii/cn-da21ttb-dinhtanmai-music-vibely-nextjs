import createHttpClient from "@/lib/createHttpClient";
import { IGenre, ResponseAPI } from "@/types";
import { GenreRequestDto } from "@/types/genre.type";

class GenreService {
  private client;

  constructor() {
    this.client = createHttpClient("api/genre");
  }

  async getAll(): Promise<ResponseAPI<IGenre[]>> {
    const res = await this.client.get<ResponseAPI<IGenre[]>>("");
    return res.data;
  }

  async create(data: GenreRequestDto): Promise<ResponseAPI<IGenre>> {
    const res = await this.client.post<ResponseAPI<IGenre>>("", data);
    return res.data;
  }

  async update(id: string, data: GenreRequestDto): Promise<ResponseAPI<IGenre>> {
    const res = await this.client.put<ResponseAPI<IGenre>>(`/${id}`, data);
    return res.data;
  }

  async delete(id: string) {
    await this.client.delete(`/${id}`);
  }
}

export default new GenreService() as GenreService;
