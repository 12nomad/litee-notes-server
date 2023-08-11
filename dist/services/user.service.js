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
exports.loginUserService = exports.registerUserService = exports.getUsersService = void 0;
const prisma_util_1 = __importDefault(require("../utils/prisma.util"));
const argon2_util_1 = require("../utils/argon2.util");
const jwt_util_1 = require("../utils/jwt.util");
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_util_1.default.user.findMany({
            select: { id: true, username: true },
        });
        return { success: true, error: null, data: users };
    }
    catch (err) {
        return {
            success: false,
            error: {
                message: "An error occurred while getting the users, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.getUsersService = getUsersService;
const registerUserService = ({ password, username, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield prisma_util_1.default.user.findUnique({
            where: { username },
        });
        if (userExists) {
            return {
                success: false,
                error: {
                    status: 400,
                    message: "Name is already taken...",
                },
                data: null,
            };
        }
        const hashed = yield (0, argon2_util_1.hash)(password);
        const newUser = yield prisma_util_1.default.user.create({
            data: { password: hashed, username },
            select: {
                id: true,
                username: true,
            },
        });
        const token = (0, jwt_util_1.signJwt)({ sub: newUser.id });
        return {
            success: true,
            error: null,
            data: newUser,
            token,
        };
    }
    catch (err) {
        return {
            success: false,
            error: {
                status: 500,
                message: "An error occurred while creating the user account, please try again later...",
            },
            data: null,
        };
    }
});
exports.registerUserService = registerUserService;
const loginUserService = ({ password, username: name, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield prisma_util_1.default.user.findUnique({
            where: { username: name },
        });
        if (!userExists) {
            return {
                success: false,
                error: {
                    status: 400,
                    message: "No user associated with the provided name, please create an account first...",
                },
                data: null,
            };
        }
        const isValid = yield (0, argon2_util_1.verify)(userExists.password, password);
        if (!isValid) {
            return {
                success: false,
                error: {
                    status: 400,
                    message: "Incorrect name or password...",
                },
                data: null,
            };
        }
        const token = (0, jwt_util_1.signJwt)({ sub: userExists.id });
        const { id, username } = userExists;
        return {
            success: true,
            error: null,
            data: { id, username },
            token,
        };
    }
    catch (error) {
        return {
            success: false,
            error: {
                message: "An error occurred while login the user, please try again later...",
                status: 500,
            },
            data: null,
        };
    }
});
exports.loginUserService = loginUserService;
