import { object, string, TypeOf } from "zod";

export const getNotesSchema = object({
  params: object({
    boardId: string({ required_error: "boardId is required..." }),
  }),
});
type getNotesSchema = TypeOf<typeof getNotesSchema>;
export type TGetNotesInput = getNotesSchema["params"];
