import { object, string, TypeOf } from "zod";

export const registerUserSchema = object({
  body: object({
    username: string({ required_error: "name is required..." }),
    password: string({ required_error: "password is required..." }).min(6, {
      message: "password must be at least 6 characters...",
    }),
    passwordConfirmation: string({
      required_error: "password confirmation is required...",
    }).min(6, { message: "password must be at least 6 characters..." }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "passwords do not match...",
    path: ["passwordConfirmation"],
  }),
});
type TRegisterUserSchema = TypeOf<typeof registerUserSchema>;
export type TRegisterUserInput = Omit<
  TRegisterUserSchema["body"],
  "passwordConfirmation"
>;

export const loginUserSchema = object({
  body: object({
    username: string({ required_error: "name is required..." }),
    password: string({ required_error: "password is required..." }).min(6, {
      message: "password must be at least 6 characters...",
    }),
  }),
});
type TLoginUserSchema = TypeOf<typeof loginUserSchema>;
export type TLoginUserInput = TLoginUserSchema["body"];
