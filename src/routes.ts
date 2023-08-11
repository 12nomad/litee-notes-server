import { Express } from "express";
import { Server } from "socket.io";

import validate from "./middlewares/validate.middleware";
import auth from "./middlewares/auth.middleware";
import {
  getAuthUserController,
  getUsersController,
  loginUserController,
  registerUserController,
} from "./controllers/user.controller";
import { loginUserSchema, registerUserSchema } from "./schemas/user.schema";
import {
  createBoardController,
  getBoardByIdController,
  getBoardsController,
  joinBoardController,
  leaveBoardController,
  updateBoardController,
} from "./controllers/board.controller";
import authUser from "./middlewares/auth-user.middleware";
import { createBoardSchema } from "./schemas/board.schema";
import Event from "./enums/event.enum";
import socketAuth from "./middlewares/socket-auth.middleware";
import {
  createQueueController,
  deleteQueueController,
  getQueuesController,
  updateQueueController,
} from "./controllers/queue.controller";
import {
  createNoteController,
  deleteNoteController,
  getNotesController,
  updateNoteController,
} from "./controllers/note.controller";

const routes = (app: Express, io: Server) => {
  // TODO: /api/users
  app.get("/api/users", auth, authUser, getUsersController);
  app.get("/api/user", auth, authUser, getAuthUserController);
  app.post(
    "/api/user/register",
    validate(registerUserSchema),
    registerUserController
  );
  app.post("/api/user/login", validate(loginUserSchema), loginUserController);

  // TODO: /api/boards
  app.get("/api/boards", auth, authUser, getBoardsController);
  app.get("/api/boards/:boardId", auth, authUser, getBoardByIdController);
  app.post(
    "/api/boards",
    auth,
    authUser,
    validate(createBoardSchema),
    createBoardController
  );
  app.get("/api/boards/:boardId/queues", auth, authUser, getQueuesController);
  app.get(
    "/api/boards/:boardId/queues/:queueId/notes",
    auth,
    authUser,
    getNotesController
  );

  // TODO: sockets
  io.use(socketAuth).on("connection", (socket) => {
    socket.on<`${Event}`>("BOARD_JOIN", (data) =>
      joinBoardController(io, socket, data)
    );
    socket.on<`${Event}`>("BOARD_LEAVE", (data) =>
      leaveBoardController(io, socket, data)
    );
    socket.on<`${Event}`>("QUEUE_CREATE", (data) =>
      createQueueController(io, socket, data)
    );
    socket.on<`${Event}`>("NOTE_CREATE", (data) =>
      createNoteController(io, socket, data)
    );
    socket.on<`${Event}`>("BOARD_UPDATE", (data) =>
      updateBoardController(io, socket, data)
    );
    socket.on<`${Event}`>("QUEUE_UPDATE", (data) =>
      updateQueueController(io, socket, data)
    );
    socket.on<`${Event}`>("QUEUE_DELETE", (data) =>
      deleteQueueController(io, socket, data)
    );
    socket.on<`${Event}`>("NOTE_UPDATE", (data) =>
      updateNoteController(io, socket, data)
    );
    socket.on<`${Event}`>("NOTE_DELETE", (data) =>
      deleteNoteController(io, socket, data)
    );
  });
};

export default routes;
