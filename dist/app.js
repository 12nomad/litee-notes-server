"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const socket_io_1 = require("socket.io");
const logger_util_1 = __importDefault(require("./utils/logger.util"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const httpServer = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "https://litee-notes.netlify.app",
    },
});
app.use((0, cors_1.default)({
    origin: "https://litee-notes.netlify.app",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
httpServer.listen(PORT, () => {
    logger_util_1.default.info(`Server running at http://localhost:${PORT}...`);
    (0, routes_1.default)(app, io);
});
