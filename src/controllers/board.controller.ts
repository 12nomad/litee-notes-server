import { Request, Response } from "express";
import { Server } from "socket.io";

import {
  createBoardService,
  getBoardByIdService,
  getBoardsService,
  updateBoardService,
} from "../services/board.service";
import { TCreateBoardInput, TGetBoardByIdInput } from "../schemas/board.schema";
import { SocketExtended } from "../interfaces/socket-extended.interface";
import Event from "../enums/event.enum";

export const getBoardsController = async (req: Request, res: Response) => {
  try {
    const result = await getBoardsService(req.user.id);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const createBoardController = async (
  req: Request<object, object, TCreateBoardInput>,
  res: Response
) => {
  try {
    const result = await createBoardService(req.user.id, req.body.title);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const getBoardByIdController = async (
  req: Request<TGetBoardByIdInput>,
  res: Response
) => {
  try {
    const result = await getBoardByIdService(req.params.boardId);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// TODO: Socket
export const joinBoardController = (
  io: Server,
  socket: SocketExtended,
  { boardId }: { boardId: string }
) => {
  socket.join(boardId.toString());
  console.log("join");
};

export const leaveBoardController = (
  io: Server,
  socket: SocketExtended,
  { boardId }: { boardId: string }
) => {
  socket.leave(boardId.toString());
  console.log("leave");
};

export const updateBoardController = async (
  io: Server,
  socket: SocketExtended,
  { boardId, title }: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.BOARD_UPDATE_FAILED, "Unauthorized");

    const newBoard = await updateBoardService(boardId, title, socket.user.id);

    if (!newBoard.success)
      return io.emit(Event.BOARD_UPDATE_FAILED, newBoard.error?.message);

    io.to(boardId).emit(Event.BOARD_UPDATE_SUCCESS, {
      board: newBoard.data,
    });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.BOARD_UPDATE_FAILED, error || String(error));
  }
};
