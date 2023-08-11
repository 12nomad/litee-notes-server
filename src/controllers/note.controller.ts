import { Request, Response } from "express";
import { Server } from "socket.io";

import { TGetNotesInput } from "../schemas/note.schema";
import {
  createNoteService,
  deleteNoteService,
  getNotesService,
  updateNoteService,
} from "../services/note.service";
import { SocketExtended } from "../interfaces/socket-extended.interface";
import Event from "../enums/event.enum";

export const getNotesController = async (
  req: Request<TGetNotesInput>,
  res: Response
) => {
  try {
    const result = await getNotesService(req.user.id, req.params.boardId);
    if (result?.error)
      return res.status(result.error.status).send(result.error.message);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// TODO: socket
export const createNoteController = async (
  io: Server,
  socket: SocketExtended,
  {
    boardId,
    title,
    queueId,
  }: { boardId: string; title: string; queueId: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.NOTE_CREATE_FAILED, "Unauthorized");

    const newNote = await createNoteService(
      boardId,
      title,
      socket.user.id,
      queueId
    );

    if (!newNote.success)
      return io.emit(Event.NOTE_CREATE_FAILED, newNote.error?.message);

    io.to(boardId).emit(Event.NOTE_CREATE_SUCCESS, {
      note: newNote.data,
      queueId,
    });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.NOTE_CREATE_FAILED, error || String(error));
  }
};

export const updateNoteController = async (
  io: Server,
  socket: SocketExtended,
  {
    noteId,
    queueId,
    title,
    content,
    boardId,
    currentQueueId,
  }: {
    queueId: string;
    currentQueueId: string;
    noteId: string;
    boardId: string;
    title: string;
    content: string;
  }
) => {
  try {
    if (!socket.user) return io.emit(Event.NOTE_UPDATE_FAILED, "Unauthorized");

    const newNote = await updateNoteService(
      noteId,
      title,
      content,
      queueId,
      currentQueueId
    );

    if (!newNote.success)
      return io.emit(Event.NOTE_UPDATE_FAILED, newNote.error?.message);

    return io.to(boardId).emit("NOTE_UPDATE_SUCCESS", {
      note: newNote.data,
      queueId,
      isAdded: newNote.data?.isAdded,
      content: newNote.data?.content,
      currentQueueId,
    });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.NOTE_UPDATE_FAILED, error || String(error));
  }
};

export const deleteNoteController = async (
  io: Server,
  socket: SocketExtended,
  {
    boardId,
    noteId,
    queueId,
  }: { noteId: string; boardId: string; queueId: string }
) => {
  try {
    if (!socket.user) return io.emit(Event.NOTE_DELETE_FAILED, "Unauthorized");

    const newQueue = await deleteNoteService(noteId);

    if (!newQueue.success)
      return io.emit(Event.NOTE_DELETE_FAILED, newQueue.error?.message);

    io.to(boardId).emit(Event.NOTE_DELETE_SUCCESS, {
      noteId,
      queueId,
    });
  } catch (error) {
    if (error instanceof Error)
      return io.emit(Event.NOTE_DELETE_FAILED, error || String(error));
  }
};
