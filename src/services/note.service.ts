import { Note } from "@prisma/client";

import { IOutput } from "../interfaces/output.interface";
import prisma from "../utils/prisma.util";

export const getNotesService = async (
  ownerId: number,
  boardId: string
): Promise<IOutput<Note[]>> => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        AND: [{ ownerId }, { boardId: +boardId }],
      },
    });
    return { success: true, data: notes, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while getting the notes, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const createNoteService = async (
  boardId: string,
  title: string,
  ownerId: number,
  queueId: string
): Promise<IOutput<Note>> => {
  try {
    const noteExists = await prisma.note.findFirst({
      where: { title, queueId: +queueId },
    });

    if (noteExists)
      return {
        success: false,
        error: {
          message:
            "A note with the same title already exists within the queue...",
          status: 400,
        },
        data: null,
      };

    const note = await prisma.note.create({
      data: { boardId: +boardId, title, ownerId, queueId: +queueId },
    });
    return { success: true, data: note, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while creating the note, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const updateNoteService = async (
  noteId: string,
  title: string,
  content: string,
  queueId: string,
  currentQueueId: string
): Promise<IOutput<Note & { isAdded: boolean }>> => {
  try {
    if (!title)
      return {
        success: false,
        data: null,
        error: { message: "You must provide a title...", status: 400 },
      };

    let isAdded = false;
    const [prevNote, titleExistsInCurrentQueue, noteTitleInQueue] =
      await prisma.$transaction([
        prisma.note.findUnique({ where: { id: +noteId } }),
        prisma.note.findFirst({
          where: { AND: [{ title }, { id: { not: +noteId } }] },
        }),
        prisma.note.findFirst({
          where: { AND: [{ title }, { queueId: +queueId }] },
        }),
      ]);

    if (prevNote?.queueId !== +queueId) isAdded = true;

    if (currentQueueId === queueId && titleExistsInCurrentQueue)
      return {
        success: false,
        data: null,
        error: {
          message:
            "Note with the same title already exists within the queue...",
          status: 400,
        },
      };

    if (currentQueueId !== queueId && noteTitleInQueue)
      return {
        success: false,
        data: null,
        error: {
          message:
            "Note with the same title already exists in the moving queue...",
          status: 400,
        },
      };

    const note = await prisma.note.update({
      where: { id: +noteId },
      data: { title, content, queueId: +queueId },
    });
    return { success: true, data: { ...note, isAdded }, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while updating the queue, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const deleteNoteService = async (
  noteId: string
): Promise<IOutput<Note>> => {
  try {
    if (!noteId)
      return {
        success: false,
        data: null,
        error: { message: "You must provide the noteId...", status: 400 },
      };

    const note = await prisma.note.delete({
      where: { id: +noteId },
    });
    return { success: true, data: note, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while deleting the queue, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};
