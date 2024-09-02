"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chromadb_1 = require("chromadb");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const chromaClient = new chromadb_1.ChromaClient({
    path: process.env.CHROMADB_URL,
});
const openAIEmbedder = new chromadb_1.OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
});
router.route("/").get((req, res) => {
    res.send("completions route");
});
exports.default = router;
