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
exports.deleteNoteService = exports.updateNoteService = exports.createNoteService = exports.getNotesService = void 0;
const prisma_util_1 = __importDefault(require("../utils/prisma.util"));
const getNotesService = (ownerId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield prisma_util_1.default.note.findMany({
            where: {
                AND: [{ ownerId }, { boardId: +boardId }],
            },
        });
        return { success: true, data: notes, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while getting the notes, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.getNotesService = getNotesService;
const createNoteService = (boardId, title, ownerId, queueId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteExists = yield prisma_util_1.default.note.findFirst({
            where: { title, queueId: +queueId },
        });
        if (noteExists)
            return {
                success: false,
                error: {
                    message: "A note with the same title already exists within the queue...",
                    status: 400,
                },
                data: null,
            };
        const note = yield prisma_util_1.default.note.create({
            data: { boardId: +boardId, title, ownerId, queueId: +queueId },
        });
        return { success: true, data: note, error: null };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while creating the note, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.createNoteService = createNoteService;
const updateNoteService = (noteId, title, content, queueId, currentQueueId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!title)
            return {
                success: false,
                data: null,
                error: { message: "You must provide a title...", status: 400 },
            };
        let isAdded = false;
        const [prevNote, titleExistsInCurrentQueue, noteTitleInQueue] = yield prisma_util_1.default.$transaction([
            prisma_util_1.default.note.findUnique({ where: { id: +noteId } }),
            prisma_util_1.default.note.findFirst({
                where: { AND: [{ title }, { id: { not: +noteId } }] },
            }),
            prisma_util_1.default.note.findFirst({
                where: { AND: [{ title }, { queueId: +queueId }] },
            }),
        ]);
        if ((prevNote === null || prevNote === void 0 ? void 0 : prevNote.queueId) !== +queueId)
            isAdded = true;
        if (currentQueueId === queueId && titleExistsInCurrentQueue)
            return {
                success: false,
                data: null,
                error: {
                    message: "Note with the same title already exists within the queue...",
                    status: 400,
                },
            };
        if (currentQueueId !== queueId && noteTitleInQueue)
            return {
                success: false,
                data: null,
                error: {
                    message: "Note with the same title already exists in the moving queue...",
                    status: 400,
                },
            };
        const note = yield prisma_util_1.default.note.update({
            where: { id: +noteId },
            data: { title, content, queueId: +queueId },
        });
        return { success: true, data: Object.assign(Object.assign({}, note), { isAdded }), error: null };
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
exports.updateNoteService = updateNoteService;
const deleteNoteService = (noteId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!noteId)
            return {
                success: false,
                data: null,
                error: { message: "You must provide the noteId...", status: 400 },
            };
        const note = yield prisma_util_1.default.note.delete({
            where: { id: +noteId },
        });
        return { success: true, data: note, error: null };
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
exports.deleteNoteService = deleteNoteService;
