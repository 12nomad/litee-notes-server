import argon2 from "argon2";

export const hash = async (password: string) => await argon2.hash(password);
export const verify = async (password: string, candidate: string) =>
  await argon2.verify(password, candidate);
