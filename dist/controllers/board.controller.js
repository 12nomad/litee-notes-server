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
exports.updateBoardController = exports.leaveBoardController = exports.joinBoardController = exports.getBoardByIdController = exports.createBoardController = exports.getBoardsController = void 0;
const board_service_1 = require("../services/board.service");
const event_enum_1 = __importDefault(require("../enums/event.enum"));
const getBoardsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, board_service_1.getBoardsService)(req.user.id);
        if (result === null || result === void 0 ? void 0 : result.error)
            return res.status(result.error.status).send(result.error.message);
        return res.send(result);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.getBoardsController = getBoardsController;
const createBoardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, board_service_1.createBoardService)(req.user.id, req.body.title);
        if (result === null || result === void 0 ? void 0 : result.error)
            return res.status(result.error.status).send(result.error.message);
        return res.send(result);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.createBoardController = createBoardController;
const getBoardByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, board_service_1.getBoardByIdService)(req.params.boardId);
        if (result === null || result === void 0 ? void 0 : result.error)
            return res.status(result.error.status).send(result.error.message);
        return res.send(result);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.getBoardByIdController = getBoardByIdController;
// TODO: Socket
const joinBoardController = (io, socket, { boardId }) => socket.join(boardId);
exports.joinBoardController = joinBoardController;
const leaveBoardController = (io, socket, { boardId }) => socket.leave(boardId);
exports.leaveBoardController = leaveBoardController;
const updateBoardController = (io, socket, { boardId, title }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.BOARD_UPDATE_FAILED, "Unauthorized");
        const newBoard = yield (0, board_service_1.updateBoardService)(boardId, title, socket.user.id);
        if (!newBoard.success)
            return io.emit(event_enum_1.default.BOARD_UPDATE_FAILED, (_a = newBoard.error) === null || _a === void 0 ? void 0 : _a.message);
        io.to(boardId).emit(event_enum_1.default.BOARD_UPDATE_SUCCESS, {
            board: newBoard.data,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.BOARD_UPDATE_FAILED, error || String(error));
    }
});
exports.updateBoardController = updateBoardController;
