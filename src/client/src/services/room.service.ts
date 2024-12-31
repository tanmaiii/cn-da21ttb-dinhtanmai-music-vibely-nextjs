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

class RoomService {
  static client = createHttpClient("api/room");

  async getAll(params: QueryParams): Promise<ResponseAPI<ListResponse<IRoom>>> {
    const res = await (
      await RoomService.client
    ).get<ResponseAPI<ListResponse<IRoom>>>("", { params });
    return res.data;
  }

  async getById(id: string): Promise<ResponseAPI<IRoom>> {
    const res = await (
      await RoomService.client
    ).get<ResponseAPI<IRoom>>(`/${id}`);
    return res.data;
  }

  async getAllSong(id: string): Promise<ResponseAPI<ISong[]>> {
    const res = await (
      await RoomService.client
    ).get<ResponseAPI<ISong[]>>(`/${id}/song`);
    return res.data;
  }

  async create(data: RoomRequestDto): Promise<ResponseAPI<IRoom>> {
    const res = await (
      await RoomService.client
    ).post<ResponseAPI<IRoom>>("", data);
    return res.data;
  }

  async getMembers(
    id: string,
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IArtist>>> {
    const res = await (
      await RoomService.client
    ).get<ResponseAPI<ListResponse<IArtist>>>(`/${id}/member`, {
      params,
    });
    return res.data;
  }
}

export default new RoomService() as RoomService;
