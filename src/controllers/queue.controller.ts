import { Request, Response } from "express";
import { Server } from "socket.io";

import { TGetBoardsInput } from "../schemas/queue.schema";
import {
  createQueueService,
  deleteQueueService,
  getQueuesService,
  updateQueueService,
} from "../services/queue.service";
import { SocketExtended } from "../interfaces/socket-extended.interface";
import Event from "../enums/event.enum";

export const getQueuesController = async (
  req: Request<TGetBoardsInput>,
  res: Response
) => {
  try {
    const result = await getQueuesService(req.user.id, req.params.boardId);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// TODO: socket
export const createQueueController = async (
  io: Server,
  socket: SocketExtended,
  { boardId, title }: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.QUEUE_CREATE_FAILED, "Unauthorized");

    const newQueue = await createQueueService(boardId, title, socket.user.id);

    if (!newQueue.success)
      return io.emit(Event.QUEUE_CREATE_FAILED, newQueue.error?.message);

    return io.to(boardId).emit(Event.QUEUE_CREATE_SUCCESS, newQueue.data);
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.QUEUE_CREATE_FAILED, error || String(error));
  }
};

export const updateQueueController = async (
  io: Server,
  socket: SocketExtended,
  {
    boardId,
    queueId,
    title,
  }: { queueId: string; boardId: string; title: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.QUEUE_UPDATE_FAILED, "Unauthorized");

    const newQueue = await updateQueueService(queueId, title, boardId);

    if (!newQueue.success)
      return io.emit(Event.QUEUE_UPDATE_FAILED, newQueue.error?.message);

    return io
      .to(boardId)
      .emit("QUEUE_UPDATE_SUCCESS", { queue: newQueue.data, queueId });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.QUEUE_UPDATE_FAILED, error || String(error));
  }
};

export const deleteQueueController = async (
  io: Server,
  socket: SocketExtended,
  { boardId, queueId }: { queueId: string; boardId: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.QUEUE_DELETE_FAILED, "Unauthorized");

    const newQueue = await deleteQueueService(queueId);

    if (!newQueue.success)
      return io.emit(Event.QUEUE_DELETE_FAILED, newQueue.error?.message);

    io.to(boardId).emit(Event.QUEUE_DELETE_SUCCESS, {
      queueId,
    });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.QUEUE_DELETE_FAILED, error || String(error));
  }
};
