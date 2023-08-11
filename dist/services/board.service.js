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
exports.updateBoardService = exports.getBoardByIdService = exports.createBoardService = exports.getBoardsService = void 0;
const prisma_util_1 = __importDefault(require("../utils/prisma.util"));
const getBoardsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield prisma_util_1.default.board.findMany({ where: { ownerId: userId } });
        return { success: true, data: boards, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while getting the boards, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.getBoardsService = getBoardsService;
const createBoardService = (userId, title) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardExists = yield prisma_util_1.default.board.findFirst({
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
        const board = yield prisma_util_1.default.board.create({
            data: { title, ownerId: userId },
        });
        return { success: true, data: board, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while creating the board, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.createBoardService = createBoardService;
const getBoardByIdService = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield prisma_util_1.default.board.findUnique({ where: { id: +boardId } });
        return { success: true, data: board, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while getting the board, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.getBoardByIdService = getBoardByIdService;
const updateBoardService = (boardId, title, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!title)
            return {
                success: false,
                data: null,
                error: { message: "You must provide a title...", status: 400 },
            };
        const boardExists = yield prisma_util_1.default.board.findFirst({
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
        const board = yield prisma_util_1.default.board.update({
            where: { id: +boardId },
            data: { title },
        });
        return { success: true, data: board, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while updating the note, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.updateBoardService = updateBoardService;
