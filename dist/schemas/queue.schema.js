"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoardsSchema = void 0;
const zod_1 = require("zod");
exports.getBoardsSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        boardId: (0, zod_1.string)({ required_error: "boardId is required..." }),
    }),
});
