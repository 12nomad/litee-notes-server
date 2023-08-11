import { Request, Response } from "express";

import {
  getUsersService,
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { TLoginUserInput, TRegisterUserInput } from "../schemas/user.schema";

export const getAuthUserController = async (req: Request, res: Response) =>
  res.send(req.user);

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const result = await getUsersService();
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const registerUserController = async (
  req: Request<object, object, TRegisterUserInput>,
  res: Response
) => {
  try {
    const result = await registerUserService(req.body);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const loginUserController = async (
  req: Request<object, object, TLoginUserInput>,
  res: Response
) => {
  try {
    const result = await loginUserService(req.body);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};
