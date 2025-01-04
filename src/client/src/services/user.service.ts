import createHttpClient from "@/lib/createHttpClient";
import { ListResponse, ResponseAPI } from "@/types";
import { IUser, QueryParamsUser, UserRequestDto } from "@/types/user.type";
import { AxiosInstance } from "axios";

class UserService {
  private client: AxiosInstance;

  constructor() {
    this.client = createHttpClient("api/user");
  }

  async getAllUsers(
    params: QueryParamsUser
  ): Promise<ResponseAPI<ListResponse<IUser>>> {
    const res = await this.client.get<ResponseAPI<ListResponse<IUser>>>("/", {
      params,
    });
    return res.data;
  }

  async getUserById(id: string) {
    const res = await this.client.get(`/${id}`);
    return res.data;
  }

  async create(data: UserRequestDto) {
    const res = await this.client.post("/", data);
    return res.data;
  }

  async update(id: string, data: UserRequestDto) {
    const res = await this.client.put(`/${id}`, data);
    return res.data;
  }

  async delete(id: string) {
    const res = await this.client.delete(`/${id}`);
    return res.data;
  }
}

export default new UserService() as UserService;
