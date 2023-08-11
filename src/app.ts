import express, { Express } from "express";
import { createServer } from "node:http";
import { config } from "dotenv";
import { Server } from "socket.io";

import logger from "./utils/logger.util";
import cors from "cors";
import routes from "./routes";

config();
const PORT: number = process.env.PORT;
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://litee-notes.netlify.app",
  },
});

app.use(
  cors({
    origin: "https://litee-notes.netlify.app",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

httpServer.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}...`);
  routes(app, io);
});
