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
exports.deleteQueueController = exports.updateQueueController = exports.createQueueController = exports.getQueuesController = void 0;
const queue_service_1 = require("../services/queue.service");
const event_enum_1 = __importDefault(require("../enums/event.enum"));
const getQueuesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, queue_service_1.getQueuesService)(req.user.id, req.params.boardId);
        if (result === null || result === void 0 ? void 0 : result.error)
            return res.status(result.error.status).send(result.error.message);
        return res.send(result);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.getQueuesController = getQueuesController;
// TODO: socket
const createQueueController = (io, socket, { boardId, title }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.QUEUE_CREATE_FAILED, "Unauthorized");
        const newQueue = yield (0, queue_service_1.createQueueService)(boardId, title, socket.user.id);
        if (!newQueue.success)
            return io.emit(event_enum_1.default.QUEUE_CREATE_FAILED, (_a = newQueue.error) === null || _a === void 0 ? void 0 : _a.message);
        return io.to(boardId).emit(event_enum_1.default.QUEUE_CREATE_SUCCESS, newQueue.data);
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.QUEUE_CREATE_FAILED, error || String(error));
    }
});
exports.createQueueController = createQueueController;
const updateQueueController = (io, socket, { boardId, queueId, title, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.QUEUE_UPDATE_FAILED, "Unauthorized");
        const newQueue = yield (0, queue_service_1.updateQueueService)(queueId, title, boardId);
        if (!newQueue.success)
            return io.emit(event_enum_1.default.QUEUE_UPDATE_FAILED, (_b = newQueue.error) === null || _b === void 0 ? void 0 : _b.message);
        return io
            .to(boardId)
            .emit("QUEUE_UPDATE_SUCCESS", { queue: newQueue.data, queueId });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.QUEUE_UPDATE_FAILED, error || String(error));
    }
});
exports.updateQueueController = updateQueueController;
const deleteQueueController = (io, socket, { boardId, queueId }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!socket.user)
            return io.emit(event_enum_1.default.QUEUE_DELETE_FAILED, "Unauthorized");
        const newQueue = yield (0, queue_service_1.deleteQueueService)(queueId);
        if (!newQueue.success)
            return io.emit(event_enum_1.default.QUEUE_DELETE_FAILED, (_c = newQueue.error) === null || _c === void 0 ? void 0 : _c.message);
        io.to(boardId).emit(event_enum_1.default.QUEUE_DELETE_SUCCESS, {
            queueId,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return io.emit(event_enum_1.default.QUEUE_DELETE_FAILED, error || String(error));
    }
});
exports.deleteQueueController = deleteQueueController;
