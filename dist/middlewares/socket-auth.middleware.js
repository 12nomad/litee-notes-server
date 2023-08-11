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
const jwt_util_1 = require("../utils/jwt.util");
const prisma_util_1 = __importDefault(require("../utils/prisma.util"));
const socketAuth = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = socket.handshake.auth.notes_at) !== null && _a !== void 0 ? _a : "";
        const { sub } = (0, jwt_util_1.verifyJwt)(token);
        const user = yield prisma_util_1.default.user.findUnique({
            where: { id: sub },
            select: { id: true, username: true },
        });
        if (!user)
            return next(new Error("Auth error..."));
        socket.user = user;
        return next();
    }
    catch (error) {
        return next(new Error("Auth error..."));
    }
});
exports.default = socketAuth;
