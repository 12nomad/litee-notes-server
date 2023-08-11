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
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s/, "").trim();
        if (!token)
            return res.sendStatus(401);
        const { sub } = (0, jwt_util_1.verifyJwt)(token);
        const user = yield prisma_util_1.default.user.findUnique({
            where: { id: sub },
            select: { id: true, username: true },
        });
        if (!user)
            return res.sendStatus(401);
        req.user = user;
        return next();
    }
    catch (error) {
        return res.sendStatus(401);
    }
});
exports.default = auth;
