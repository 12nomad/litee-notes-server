import { object, string, TypeOf } from "zod";

export const createBoardSchema = object({
  body: object({
    title: string({ required_error: "title is required..." }),
  }),
});
type createBoardSchema = TypeOf<typeof createBoardSchema>;
export type TCreateBoardInput = createBoardSchema["body"];

export const getBoardByIdSchema = object({
  params: object({
    boardId: string({ required_error: "boardId is required..." }),
  }),
});
type getBoardByIdSchema = TypeOf<typeof getBoardByIdSchema>;
export type TGetBoardByIdInput = getBoardByIdSchema["params"];
