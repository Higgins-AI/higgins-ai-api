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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("GET COMPLETIONS");
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
            .from("chat_completion")
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
    var _c, _d, _e, _f;
    try {
        console.log("POST COMPLETION");
        const userInput = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.user_input;
        const messages = ((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.messages) || [];
        const userId = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.user_id;
        const chatId = (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.chat_id;
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
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const response = yield axios_1.default.post(`https://api.openai.com/v1/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: [
                ...messages,
                {
                    role: "system",
                    content: "You are a helpful assistant",
                },
                { role: "user", content: userInput },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        if (response.statusText === "OK") {
            const completionData = response.data;
            const { data, error } = yield supabase
                .from("chat_completion")
                .upsert({
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
    var _g, _h, _j;
    try {
        console.log("GET COMPLETION");
        const userId = (_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.user_id;
        const chatId = (_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.chat_id;
        const completionId = (_j = req === null || req === void 0 ? void 0 : req.params) === null || _j === void 0 ? void 0 : _j.id;
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
            .from("chat_completion")
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
