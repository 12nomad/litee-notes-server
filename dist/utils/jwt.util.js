"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJwt = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_PRIVATE, Object.assign({ algorithm: "RS256", expiresIn: process.env.ACCESS_TOKEN_EXP }, (options && options)));
};
exports.signJwt = signJwt;
const verifyJwt = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_PUBLIC);
};
exports.verifyJwt = verifyJwt;
