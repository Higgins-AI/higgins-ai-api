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
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const router = express_1.default.Router();
const chromaClient = new chromadb_1.ChromaClient({
    path: process.env.CHROMADB_URL,
});
const openAIEmbedder = new chromadb_1.OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
});
const getRelatedDocs = (inputString, organization) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield chromaClient.getCollection({
        name: organization,
        embeddingFunction: openAIEmbedder,
    });
    const documents = yield collection.query({
        queryTexts: inputString,
        nResults: 5,
    });
    if (!documents.documents) {
        return undefined;
    }
    return documents.documents;
});
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("GET HIGGINS COMPLETIONS");
        const userId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.user_id;
        const chatId = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.chat_id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        if (!chatId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "No Chat Input Provided" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data, error } = yield supabase
            .from("higgins_chat_completion")
            .select()
            .eq("user_id", userId)
            .eq("chat_id", chatId)
            .order("created", { ascending: true });
        if (error) {
            console.log(error);
            res.status(500);
            res.send({ ok: false, data: [], message: error.message });
            return;
        }
        console.log(data);
        res.status(200);
        res.send({ ok: true, data: data, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        console.log("POST HIGGINS COMPLETION");
        const systemDirective = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.system_directive;
        const userInput = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.user_input;
        const messages = ((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.messages) || [];
        const userId = (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.user_id;
        const chatId = (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.chat_id;
        const temperature = (_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.chat_id;
        const organization = (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.organization;
        if (!userInput) {
            res.status(400);
            res.send({ ok: false, data: [], message: "No User Input Provided" });
            return;
        }
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        if (!chatId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Invalid Request" });
            return;
        }
        if (!organization) {
            res.status(400);
            res.send({ ok: false, data: [], message: "No Organization Provided" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const docs = yield getRelatedDocs(userInput, organization);
        const supportingDocs = (_k = docs === null || docs === void 0 ? void 0 : docs.at(0)) === null || _k === void 0 ? void 0 : _k.map((doc) => doc === null || doc === void 0 ? void 0 : doc.replace("\n", " "));
        const defaultSystemDirective = `Your name is Higgins. You are a helpful assistant for the company ${organization}. I will provide you some supporting documents that you can use to help you respond to the user's next prompt. If the supporting documents do not closely relate to the user's prompt, ignore them as you formulate a response. If the user's prompt refers to any previous messages, ignore the supporting documents as you formulate a response. The following text is the supporting documents: ${supportingDocs}`;
        const response = yield axios_1.default.post(`https://api.openai.com/v1/chat/completions`, {
            model: "gpt-3.5-turbo-16k",
            messages: [
                ...messages,
                {
                    role: "system",
                    content: systemDirective
                        ? systemDirective + supportingDocs
                        : defaultSystemDirective,
                },
                { role: "user", content: userInput },
            ],
            temperature: temperature ? Number(temperature) : 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        if (response.statusText === "OK") {
            const completionData = response.data;
            const { data, error } = yield supabase
                .from("higgins_chat_completion")
                .insert({
                id: completionData.id,
                object: completionData.object,
                created: completionData.created,
                model: completionData.model,
                role: completionData.choices[0].message.role,
                message: completionData.choices[0].message.content,
                finish_reason: completionData.choices[0].finish_reason,
                prompt_tokens: completionData.usage.prompt_tokens,
                completion_tokens: completionData.usage.completion_tokens,
                total_tokens: completionData.usage.total_tokens,
                user_id: userId,
                chat_id: chatId,
                prompt: userInput,
                documents: supportingDocs,
            })
                .select()
                .single();
            if (error) {
                console.log(error);
                res.status(500);
                res.send({ ok: false, data: [], message: error.message });
                return;
            }
            console.log(data);
            res.status(200);
            res.send({ ok: true, data: data, message: "success" });
        }
        else {
            console.log(response.statusText);
            res.status(500);
            res.send({ ok: false, data: [], message: response.statusText });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o;
    try {
        const userId = (_l = req === null || req === void 0 ? void 0 : req.query) === null || _l === void 0 ? void 0 : _l.user_id;
        const chatId = (_m = req === null || req === void 0 ? void 0 : req.params) === null || _m === void 0 ? void 0 : _m.id;
        const completionId = (_o = req === null || req === void 0 ? void 0 : req.params) === null || _o === void 0 ? void 0 : _o.id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        if (!chatId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "No Chat Input Provided" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data, error } = yield supabase
            .from("higgins_chat_completion")
            .select()
            .eq("user_id", userId)
            .eq("chat_id", chatId)
            .eq("id", completionId)
            .single();
        if (error) {
            console.log(error);
            res.status(500);
            res.send({ ok: false, data: [], message: error.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: data, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
exports.default = router;
