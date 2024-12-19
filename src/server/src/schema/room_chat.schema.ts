import { array, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from "./common.schema";

const payload = {
  body: object({
    content: string({
      required_error: "Content is required",
    }).max(SIZE.DESCRIPTION, "Content is too long"),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id role is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

export const getChatSchema = object({ ...params, ...querySchema });
export const createChatSchema = object({ ...params, ...payload });
export const deleteChatSchema = object({ ...params });

export type GetChatInput = TypeOf<typeof getChatSchema>;
export type CreateChatInput = TypeOf<typeof createChatSchema>;
export type DeleteChatInput = TypeOf<typeof deleteChatSchema>;
