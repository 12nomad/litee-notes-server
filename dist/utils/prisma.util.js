"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
if (!global.__db) {
    global.__db = new client_1.PrismaClient();
}
const prisma = global.__db;
exports.default = prisma;
