import { verifyJwt } from "../utils/jwt.util";
import { ExtendedError } from "socket.io/dist/namespace";
import prisma from "../utils/prisma.util";
import { SocketExtended } from "../interfaces/socket-extended.interface";

const socketAuth = async (
  socket: SocketExtended,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const token = (socket.handshake.auth.notes_at as string) ?? "";
    const { sub } = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, username: true },
    });

    if (!user) return next(new Error("Auth error..."));

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Auth error..."));
  }
};

export default socketAuth;
