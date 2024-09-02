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
    var _a, _b;
    try {
        console.log("GET HIGGINS CHATS");
        const userId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.user_id;
        const organization = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.organization;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        if (!organization) {
            res.status(400);
            res.send({ ok: false, data: [], message: "No Organization provided" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: chats, error: chatsError } = yield supabase
            .from("higgins_chat")
            .select()
            .eq("user_id", userId)
            .eq("organization", organization)
            .order("created_at", { ascending: true });
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
    var _c, _d, _e, _f, _g;
    try {
        console.log("POST HIGGINS CHAT");
        let title = ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.title) || "New Chat";
        const userId = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.user_id;
        const createdAt = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.created_at;
        const chatId = (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.chat_id;
        const organization = (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.organization;
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
        if (!organization) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Organization provided",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: count, error: countError } = yield supabase
            .from("higgins_chat")
            .select()
            .eq("user_id", userId)
            .eq("organization", organization)
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
            .from("higgins_chat")
            .upsert({
            id: chatId,
            created_at: createdAt,
            user_id: userId,
            organization,
            title,
        })
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
    var _h, _j;
    try {
        console.log("GET HIGGINS CHAT");
        const userId = (_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.user_id;
        const chatId = (_j = req === null || req === void 0 ? void 0 : req.params) === null || _j === void 0 ? void 0 : _j.id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { data: chats, error: chatsError } = yield supabase
            .from("higgins_chat")
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
    var _k, _l;
    try {
        console.log("PATCH HIGGINS CHAT");
        const title = (_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.title;
        const chatId = (_l = req === null || req === void 0 ? void 0 : req.params) === null || _l === void 0 ? void 0 : _l.id;
        const userId = req === null || req === void 0 ? void 0 : req.body.user_id;
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
            .from("higgins_chat")
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
    var _m, _o;
    try {
        console.log("DELETE CHAT");
        const chatId = (_m = req === null || req === void 0 ? void 0 : req.params) === null || _m === void 0 ? void 0 : _m.id;
        const userId = (_o = req === null || req === void 0 ? void 0 : req.query) === null || _o === void 0 ? void 0 : _o.user_id;
        if (!userId) {
            res.status(400);
            res.send({ ok: false, data: [], message: "Authentication Error" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "authenticated" }, process.env.SUPABASE_JWT_SECRET);
        const supabase = (0, utils_1.createClient)({ req, res }, token);
        const { error } = yield supabase
            .from("higgins_chat")
            .delete()
            .eq("id", chatId)
            .eq("user_id", userId)
            .single();
        if (error) {
            res.status(500);
            res.send({ ok: false, data: [], message: error.message });
            console.log(res);
            return;
        }
        res.status(200);
        res.send({ ok: true, data: [], message: "success" });
        console.log(res);
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
