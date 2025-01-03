import createHttpClient from "@/lib/createHttpClient";
import {
  IArtist,
  IRoom,
  ISong,
  ListResponse,
  QueryParams,
  ResponseAPI,
  RoomRequestDto,
} from "@/types";
import { AddMemberRequestDto } from "@/types/room.type";
import { AxiosInstance } from "axios";

class RoomService {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient("api/room");
  }

  async getAll(params: QueryParams): Promise<ResponseAPI<ListResponse<IRoom>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IRoom>>>("", {
      params,
    });
    return res.data;
  }

  async getById(id: string): Promise<ResponseAPI<IRoom>> {
    const res = await this.client.get<ResponseAPI<IRoom>>(`/${id}`);
    return res.data;
  }

  async getAllSong(id: string): Promise<ResponseAPI<ISong[]>> {
    const res = await this.client.get<ResponseAPI<ISong[]>>(`/${id}/song`);
    return res.data;
  }

  async create(data: RoomRequestDto): Promise<ResponseAPI<IRoom>> {
    const res = await this.client.post<ResponseAPI<IRoom>>("", data);
    return res.data;
  }

  async getMembers(
    id: string,
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IArtist>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IArtist>>>(
      `/${id}/member`,
      {
        params,
      }
    );
    return res.data;
  }

  async addMember(
    id: string,
    body: AddMemberRequestDto
  ): Promise<ResponseAPI<null>> {
    const res = await this.client.post<ResponseAPI<null>>(
      `/${id}/member`,
      body
    );
    return res.data;
  }

  async checkMember(id: string): Promise<ResponseAPI<null>> {
    const res = await this.client.get<ResponseAPI<null>>(`/${id}/member/check`);
    return res.data;
  }
}

export default new RoomService() as RoomService;
