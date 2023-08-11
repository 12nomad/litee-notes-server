"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoardByIdSchema = exports.createBoardSchema = void 0;
const zod_1 = require("zod");
exports.createBoardSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({ required_error: "title is required..." }),
    }),
});
exports.getBoardByIdSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        boardId: (0, zod_1.string)({ required_error: "boardId is required..." }),
    }),
});
