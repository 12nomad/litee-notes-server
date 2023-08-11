"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({ required_error: "name is required..." }),
        password: (0, zod_1.string)({ required_error: "password is required..." }).min(6, {
            message: "password must be at least 6 characters...",
        }),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "password confirmation is required...",
        }).min(6, { message: "password must be at least 6 characters..." }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "passwords do not match...",
        path: ["passwordConfirmation"],
    }),
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({ required_error: "name is required..." }),
        password: (0, zod_1.string)({ required_error: "password is required..." }).min(6, {
            message: "password must be at least 6 characters...",
        }),
    }),
});
