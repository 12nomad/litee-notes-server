import jwt from "jsonwebtoken";

interface IPayload {
  sub: number;
}

export const signJwt = (payload: IPayload, options?: jwt.SignOptions) => {
  return jwt.sign(payload, process.env.JWT_PRIVATE, {
    algorithm: "RS256",
    expiresIn: process.env.ACCESS_TOKEN_EXP,
    ...(options && options),
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_PUBLIC) as IPayload & jwt.JwtPayload;
};
