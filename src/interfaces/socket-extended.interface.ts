import { Socket } from "socket.io";

export interface SocketExtended extends Socket {
  user?: { username: string; id: number };
}
