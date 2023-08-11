import { NextFunction, Request, Response } from "express";

import { verifyJwt } from "../utils/jwt.util";
import prisma from "../utils/prisma.util";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s/, "").trim();

    if (!token) return res.sendStatus(401);

    const { sub } = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: sub as number },
      select: { id: true, username: true },
    });

    if (!user) return res.sendStatus(401);

    req.user = user;
    return next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

export default auth;
