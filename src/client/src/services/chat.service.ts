import createHttpClient from "@/lib/createHttpClient";
import { ListResponse, QueryParams, ResponseAPI } from "@/types";
import { IMessageChat } from "@/types/room.type";

class ChatService {
  private client;

  constructor() {
    this.client = createHttpClient("api/room-chat");
  }

  async getAll(
    roomId: string,
    params: QueryParams
  ): Promise<ResponseAPI<ListResponse<IMessageChat>>> {
    const res = await (
      await this.client
    ).get<ResponseAPI<ListResponse<IMessageChat>>>("/" + roomId, { params });
    return res.data;
  }
}

export default new ChatService() as ChatService;
