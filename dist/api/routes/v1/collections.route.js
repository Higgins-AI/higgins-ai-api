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
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield chromaClient.listCollections();
    if (collections && collections.length > 0) {
        res.send(collections);
    }
}));
exports.default = router;
