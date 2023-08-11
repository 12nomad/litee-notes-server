import { object, string, TypeOf } from "zod";

export const getBoardsSchema = object({
  params: object({
    boardId: string({ required_error: "boardId is required..." }),
  }),
});
type getBoardsSchema = TypeOf<typeof getBoardsSchema>;
export type TGetBoardsInput = getBoardsSchema["params"];
