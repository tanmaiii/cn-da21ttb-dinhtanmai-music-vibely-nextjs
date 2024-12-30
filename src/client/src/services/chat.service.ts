import createHttpClient from "@/lib/createHttpClient";
import { ListResponse, QueryParams, ResponseAPI } from "@/types";
import { IMessageChat } from "@/types/room.type";

class ChatService {
  static client = createHttpClient("api/room-chat");

  async getAll(
    roomId: string,
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IMessageChat>>> {
    const res = await ChatService.client.get<
      ResponseAPI<ListResponse<IMessageChat>>
    >("/" + roomId, { params });
    return res.data;
  }
}

const chatSerive = new ChatService();
export default chatSerive;
