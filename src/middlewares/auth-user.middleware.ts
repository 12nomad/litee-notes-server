import { NextFunction, Request, Response } from "express";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401);

  return next();
};

export default authUser;
