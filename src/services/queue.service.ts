import { Queue } from "@prisma/client";

import prisma from "../utils/prisma.util";
import { IOutput } from "../interfaces/output.interface";

export const getQueuesService = async (
  ownerId: number,
  boardId: string
): Promise<IOutput<Queue[]>> => {
  try {
    const queues = await prisma.queue.findMany({
      where: { AND: [{ ownerId }, { boardId: +boardId }] },
      include: { notes: true },
    });
    return { success: true, data: queues, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while getting the queues, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const createQueueService = async (
  boardId: string,
  title: string,
  ownerId: number
): Promise<IOutput<Queue>> => {
  try {
    const queueExists = await prisma.queue.findFirst({
      where: { AND: [{ title }, { boardId: +boardId }] },
    });

    if (queueExists)
      return {
        success: false,
        error: {
          message:
            "A queue with the same title already exists in the current board...",
          status: 400,
        },
        data: null,
      };

    const queue = await prisma.queue.create({
      data: { boardId: +boardId, title, ownerId },
      include: { notes: true },
    });
    return { success: true, data: queue, error: null };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while creating the queue, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const updateQueueService = async (
  queueId: string,
  title: string,
  boardId: string
): Promise<IOutput<Queue>> => {
  try {
    if (!title)
      return {
        success: false,
        data: null,
        error: { message: "You must provide a title...", status: 400 },
      };

    const queueExists = await prisma.queue.findFirst({
      where: { AND: [{ title }, { boardId: +boardId }] },
    });

    if (queueExists)
      return {
        success: false,
        error: {
          message:
            "A queue with the same title already exists in the current board...",
          status: 400,
        },
        data: null,
      };

    const queue = await prisma.queue.update({
      where: { id: +queueId },
      data: { title },
      include: { notes: true },
    });
    return { success: true, data: queue, error: null };
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

export const deleteQueueService = async (
  queueId: string
): Promise<IOutput<Queue>> => {
  try {
    if (!queueId)
      return {
        success: false,
        data: null,
        error: { message: "You must provide the queueId...", status: 400 },
      };

    const queue = await prisma.queue.delete({
      where: { id: +queueId },
      include: { notes: true },
    });
    return { success: true, data: queue, error: null };
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
