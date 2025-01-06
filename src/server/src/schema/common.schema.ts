import { enum as enum_, object, string } from "zod";

export const querySchema = {
  query: object({
    limit: string().default("10").optional(),
    page: string().default("1").optional(),
    keyword: string().optional(),
    sort: enum_(["newest", "oldest", "mostLikes", "mostListens", "mostFollows"]).optional(),
  }),
};
