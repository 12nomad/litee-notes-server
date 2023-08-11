"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_middleware_1 = __importDefault(require("./middlewares/validate.middleware"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const user_controller_1 = require("./controllers/user.controller");
const user_schema_1 = require("./schemas/user.schema");
const board_controller_1 = require("./controllers/board.controller");
const auth_user_middleware_1 = __importDefault(require("./middlewares/auth-user.middleware"));
const board_schema_1 = require("./schemas/board.schema");
const socket_auth_middleware_1 = __importDefault(require("./middlewares/socket-auth.middleware"));
const queue_controller_1 = require("./controllers/queue.controller");
const note_controller_1 = require("./controllers/note.controller");
const routes = (app, io) => {
    // TODO: /api/users
    app.get("/api/users", auth_middleware_1.default, auth_user_middleware_1.default, user_controller_1.getUsersController);
    app.get("/api/user", auth_middleware_1.default, auth_user_middleware_1.default, user_controller_1.getAuthUserController);
    app.post("/api/user/register", (0, validate_middleware_1.default)(user_schema_1.registerUserSchema), user_controller_1.registerUserController);
    app.post("/api/user/login", (0, validate_middleware_1.default)(user_schema_1.loginUserSchema), user_controller_1.loginUserController);
    // TODO: /api/boards
    app.get("/api/boards", auth_middleware_1.default, auth_user_middleware_1.default, board_controller_1.getBoardsController);
    app.get("/api/boards/:boardId", auth_middleware_1.default, auth_user_middleware_1.default, board_controller_1.getBoardByIdController);
    app.post("/api/boards", auth_middleware_1.default, auth_user_middleware_1.default, (0, validate_middleware_1.default)(board_schema_1.createBoardSchema), board_controller_1.createBoardController);
    app.get("/api/boards/:boardId/queues", auth_middleware_1.default, auth_user_middleware_1.default, queue_controller_1.getQueuesController);
    app.get("/api/boards/:boardId/queues/:queueId/notes", auth_middleware_1.default, auth_user_middleware_1.default, note_controller_1.getNotesController);
    // TODO: sockets
    io.use(socket_auth_middleware_1.default).on("connection", (socket) => {
        socket.on("BOARD_JOIN", (data) => (0, board_controller_1.joinBoardController)(io, socket, data));
        socket.on("BOARD_LEAVE", (data) => (0, board_controller_1.leaveBoardController)(io, socket, data));
        socket.on("QUEUE_CREATE", (data) => (0, queue_controller_1.createQueueController)(io, socket, data));
        socket.on("NOTE_CREATE", (data) => (0, note_controller_1.createNoteController)(io, socket, data));
        socket.on("BOARD_UPDATE", (data) => (0, board_controller_1.updateBoardController)(io, socket, data));
        socket.on("QUEUE_UPDATE", (data) => (0, queue_controller_1.updateQueueController)(io, socket, data));
        socket.on("QUEUE_DELETE", (data) => (0, queue_controller_1.deleteQueueController)(io, socket, data));
        socket.on("NOTE_UPDATE", (data) => (0, note_controller_1.updateNoteController)(io, socket, data));
        socket.on("NOTE_DELETE", (data) => (0, note_controller_1.deleteNoteController)(io, socket, data));
    });
};
exports.default = routes;
