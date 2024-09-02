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
const utils_1 = require("../../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("GET CHATS");
        const userId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: chats, error: chatsError } = yield supabase
            .from("chat")
            .select()
            .eq("user_id", userId);
        console.log("TOKEN: ", token);
        if (chatsError) {
            res.status(500);
            res.send({ ok: false, data: [], message: chatsError.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: chats, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        console.log("POST CHAT");
        let title = ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.title) || "New Chat";
        const userId = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.user_id;
        const createdAt = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.created_at;
        const chatId = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.chat_id;
        if (!userId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "Authentication Error",
            });
            return;
        }
        if (!chatId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "Invalid Request",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: count, error: countError } = yield supabase
            .from("chat")
            .select()
            .eq("user_id", userId)
            .like("title", `%${title}%`);
        if (countError) {
            res.status(500);
            res.send({ ok: false, data: [], message: countError.message });
            return;
        }
        if (count && count.length > 1) {
            title += ` ${count.length}`;
        }
        const { data: newChat, error: newChatError } = yield supabase
            .from("chat")
            .upsert({ id: chatId, created_at: createdAt, user_id: userId, title })
            .select()
            .single();
        if (newChatError) {
            res.status(500);
            res.send({ ok: false, data: [], message: newChatError.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: newChat, message: "success" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        console.log("GET CHAT");
        const userId = (_f = req === null || req === void 0 ? void 0 : req.query) === null || _f === void 0 ? void 0 : _f.user_id;
        const chatId = (_g = req === null || req === void 0 ? void 0 : req.params) === null || _g === void 0 ? void 0 : _g.id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: chats, error: chatsError } = yield supabase
            .from("chat")
            .select()
            .eq("user_id", userId)
            .eq("id", chatId)
            .single();
        if (chatsError) {
            res.status(500);
            res.send({ ok: false, data: [], message: chatsError.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: chats, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/:id").patch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    try {
        console.log("PATCH CHAT");
        const title = (_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.title;
        const chatId = (_j = req === null || req === void 0 ? void 0 : req.params) === null || _j === void 0 ? void 0 : _j.id;
        const userId = (_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.user_id;
        if (!title) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Invalid Request" });
            return;
        }
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: chat, error: chatError } = yield supabase
            .from("chat")
            .update({ title })
            .eq("id", chatId)
            .select()
            .single();
        if (chatError) {
            res.status(500);
            res.send({ ok: false, data: [], message: chatError.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: chat, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/:id").delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m;
    try {
        console.log("DELETE CHAT");
        const supabase = (0, utils_1.createClient)({ req, res });
        const chatId = (_l = req === null || req === void 0 ? void 0 : req.params) === null || _l === void 0 ? void 0 : _l.id;
        const userId = (_m = req === null || req === void 0 ? void 0 : req.query) === null || _m === void 0 ? void 0 : _m.user_id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const { error } = yield supabase
            .from("chat")
            .delete()
            .eq("id", chatId)
            .eq("user_id", userId)
            .single();
        if (error) {
            res.status(500);
            res.send({ ok: false, data: [], message: error.message });
            return;
        }
        res.status(200);
        res.send({ ok: true, data: [], message: "success" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
exports.default = router;
