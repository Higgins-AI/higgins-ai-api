"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./api/config/express"));
const PORT = process.env.PORT || 4000;
express_1.default.listen(PORT, () => console.log("Listening on port " + PORT));
