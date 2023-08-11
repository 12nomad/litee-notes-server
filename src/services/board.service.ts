import { Board } from "@prisma/client";

import { IOutput } from "../interfaces/output.interface";
import prisma from "../utils/prisma.util";

export const getBoardsService = async (
  userId: number
): Promise<IOutput<Board[]>> => {
  try {
    const boards = await prisma.board.findMany({ where: { ownerId: userId } });
    return { success: true, data: boards, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while getting the boards, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const createBoardService = async (
  userId: number,
  title: string
): Promise<IOutput<Board>> => {
  try {
    const boardExists = await prisma.board.findFirst({
      where: { title, ownerId: userId },
    });

    if (boardExists) {
      return {
        success: false,
        error: {
          message: "Board with the same title already exists...",
          status: 400,
        },
        data: null,
      };
    }

    const board = await prisma.board.create({
      data: { title, ownerId: userId },
    });
    return { success: true, data: board, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while creating the board, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const getBoardByIdService = async (
  boardId: string
): Promise<IOutput<Board>> => {
  try {
    const board = await prisma.board.findUnique({ where: { id: +boardId } });
    return { success: true, data: board, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while getting the board, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const updateBoardService = async (
  boardId: string,
  title: string,
  ownerId: number
): Promise<IOutput<Board>> => {
  try {
    if (!title)
      return {
        success: false,
        data: null,
        error: { message: "You must provide a title...", status: 400 },
      };

    const boardExists = await prisma.board.findFirst({
      where: { title, ownerId },
    });

    if (boardExists)
      return {
        success: false,
        error: {
          message: "A Board with the same title already exists...",
          status: 400,
        },
        data: null,
      };

    const board = await prisma.board.update({
      where: { id: +boardId },
      data: { title },
    });
    return { success: true, data: board, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while updating the note, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};
