import createHttpClient from "@/lib/createHttpClient";
import { IRoom, ISong, ListResponse, QueryParams, ResponseAPI, RoomRequestDto } from "@/types";

class RoomService {
  static client = createHttpClient("api/room");

  async getAll(params: QueryParams): Promise<ResponseAPI<ListResponse<IRoom>>> {
    const res = await RoomService.client.get<ResponseAPI<ListResponse<IRoom>>>(
      "",
      { params }
    );
    return res.data;
  }

  async getById(id: string): Promise<ResponseAPI<IRoom>> {
    const res = await RoomService.client.get<ResponseAPI<IRoom>>(`/${id}`);
    return res.data;
  }

  async getAllSong(id: string): Promise<ResponseAPI<ISong[]>> {
    const res = await RoomService.client.get<ResponseAPI<ISong[]>>(
      `/${id}/song`
    );
    return res.data;
  }

  async create(data: RoomRequestDto): Promise<ResponseAPI<IRoom>> {
    const res = await RoomService.client.post<ResponseAPI<IRoom>>("", data);
    return res.data;
  }
}

const roomSerive = new RoomService();
export default roomSerive;
