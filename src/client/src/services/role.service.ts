import createHttpClient from "@/lib/createHttpClient";
import { ResponseAPI } from "@/types";
import { IPermission, IRole } from "@/types/auth.type";

export interface RoleRequestDto {
  name: string;
  permissions: string[];
}

class RoleService {
  private client;

  constructor() {
    this.client = createHttpClient("api/");
  }

  async getAllRole(): Promise<ResponseAPI<IRole[]>> {
    const res = await this.client.get("/role");
    return res.data;
  }

  async getAllPermissions(): Promise<ResponseAPI<IPermission[]>> {
    const res = await this.client.get("/permissions");
    return res.data;
  }

  async getRoleById(id: string): Promise<ResponseAPI<IRole>> {
    const res = await this.client.get(`/${id}`);
    return res.data;
  }

  async create(data: RoleRequestDto): Promise<ResponseAPI<IRole>> {
    const res = await this.client.post("/role", data);
    return res.data;
  }

  async update(id: string, data: RoleRequestDto): Promise<ResponseAPI<IRole>> {
    const res = await this.client.put(`/role/${id}`, data);
    return res.data;
  }

  async delete(id: string): Promise<ResponseAPI<null>> {
    const res = await this.client.delete(`/role/${id}`);
    return res.data;
  }
}

export default new RoleService() as RoleService;
