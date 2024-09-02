"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("express");
const v1_1 = __importDefault(require("../routes/v1"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
/**
 * Express instance
 * @public
 */
const app = (0, express_1.default)();
// enable CORS - Cross Origin Resource Sharing
app.use((0, cors_1.default)());
app.use((0, express_2.json)());
app.use((0, cookie_parser_1.default)());
// mount api v1 routes
app.use("/api/v1", v1_1.default);
exports.default = app;
