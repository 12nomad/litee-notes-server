"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQueueService = exports.updateQueueService = exports.createQueueService = exports.getQueuesService = void 0;
const prisma_util_1 = __importDefault(require("../utils/prisma.util"));
const getQueuesService = (ownerId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queues = yield prisma_util_1.default.queue.findMany({
            where: { AND: [{ ownerId }, { boardId: +boardId }] },
            include: { notes: true },
        });
        return { success: true, data: queues, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while getting the queues, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.getQueuesService = getQueuesService;
const createQueueService = (boardId, title, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queueExists = yield prisma_util_1.default.queue.findFirst({
            where: { AND: [{ title }, { boardId: +boardId }] },
        });
        if (queueExists)
            return {
                success: false,
                error: {
                    message: "A queue with the same title already exists in the current board...",
                    status: 400,
                },
                data: null,
            };
        const queue = yield prisma_util_1.default.queue.create({
            data: { boardId: +boardId, title, ownerId },
            include: { notes: true },
        });
        return { success: true, data: queue, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while creating the queue, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.createQueueService = createQueueService;
const updateQueueService = (queueId, title, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!title)
            return {
                success: false,
                data: null,
                error: { message: "You must provide a title...", status: 400 },
            };
        const queueExists = yield prisma_util_1.default.queue.findFirst({
            where: { AND: [{ title }, { boardId: +boardId }] },
        });
        if (queueExists)
            return {
                success: false,
                error: {
                    message: "A queue with the same title already exists in the current board...",
                    status: 400,
                },
                data: null,
            };
        const queue = yield prisma_util_1.default.queue.update({
            where: { id: +queueId },
            data: { title },
            include: { notes: true },
        });
        return { success: true, data: queue, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while updating the queue, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.updateQueueService = updateQueueService;
const deleteQueueService = (queueId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!queueId)
            return {
                success: false,
                data: null,
                error: { message: "You must provide the queueId...", status: 400 },
            };
        const queue = yield prisma_util_1.default.queue.delete({
            where: { id: +queueId },
            include: { notes: true },
        });
        return { success: true, data: queue, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while deleting the queue, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.deleteQueueService = deleteQueueService;
