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
exports.deleteNoteController = exports.updateNoteController = exports.createNoteController = exports.getNotesController = void 0;
const note_service_1 = require("../services/note.service");
const event_enum_1 = __importDefault(require("../enums/event.enum"));
const getNotesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, note_service_1.getNotesService)(req.user.id, req.params.boardId);
        if (result === null || result === void 0 ? void 0 : result.error)
            return res.status(result.error.status).send(result.error.message);
        return res.send(result);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.getNotesController = getNotesController;
// TODO: socket
const createNoteController = (io, socket, { boardId, title, queueId, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.NOTE_CREATE_FAILED, "Unauthorized");
        const newNote = yield (0, note_service_1.createNoteService)(boardId, title, socket.user.id, queueId);
        if (!newNote.success)
            return io.emit(event_enum_1.default.NOTE_CREATE_FAILED, (_a = newNote.error) === null || _a === void 0 ? void 0 : _a.message);
        io.to(boardId).emit(event_enum_1.default.NOTE_CREATE_SUCCESS, {
            note: newNote.data,
            queueId,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.NOTE_CREATE_FAILED, error || String(error));
    }
});
exports.createNoteController = createNoteController;
const updateNoteController = (io, socket, { noteId, queueId, title, content, boardId, currentQueueId, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.NOTE_UPDATE_FAILED, "Unauthorized");
        const newNote = yield (0, note_service_1.updateNoteService)(noteId, title, content, queueId, currentQueueId);
        if (!newNote.success)
            return io.emit(event_enum_1.default.NOTE_UPDATE_FAILED, (_b = newNote.error) === null || _b === void 0 ? void 0 : _b.message);
        return io.to(boardId).emit("NOTE_UPDATE_SUCCESS", {
            note: newNote.data,
            queueId,
            isAdded: (_c = newNote.data) === null || _c === void 0 ? void 0 : _c.isAdded,
            content: (_d = newNote.data) === null || _d === void 0 ? void 0 : _d.content,
            currentQueueId,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.NOTE_UPDATE_FAILED, error || String(error));
    }
});
exports.updateNoteController = updateNoteController;
const deleteNoteController = (io, socket, { boardId, noteId, queueId, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.NOTE_DELETE_FAILED, "Unauthorized");
        const newQueue = yield (0, note_service_1.deleteNoteService)(noteId);
        if (!newQueue.success)
            return io.emit(event_enum_1.default.NOTE_DELETE_FAILED, (_e = newQueue.error) === null || _e === void 0 ? void 0 : _e.message);
        io.to(boardId).emit(event_enum_1.default.NOTE_DELETE_SUCCESS, {
            noteId,
            queueId,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.NOTE_DELETE_FAILED, error || String(error));
    }
});
exports.deleteNoteController = deleteNoteController;
