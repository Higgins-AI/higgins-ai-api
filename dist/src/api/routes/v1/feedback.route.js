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
dotenv_1.default.config();
const router = express_1.default.Router();
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log("GET FEEDBACK");
        const supabase = (0, utils_1.createClient)({ req, res });
        const userId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.user_id;
        const completionId = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.completion_id;
        const chatId = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.chat_id;
        if (!userId) {
            res.status(400);
            res.send({
                ok: false,
                data: undefined,
                message: "Authentication Error",
            });
            return;
        }
        if (!completionId) {
            res.status(400);
            res.send({
                ok: false,
                data: undefined,
                message: "No Completions ID provided",
            });
            return;
        }
        if (!chatId) {
            res.status(400);
            res.send({
                ok: false,
                data: undefined,
                message: "Invalid Request",
            });
            return;
        }
        const { data, error } = yield supabase
            .from("completion_feedback")
            .select()
            .eq("user_id", userId)
            .eq("completion_id", completionId)
            .eq("chat_id", chatId);
        console.log(data);
        if (!error) {
            res.status(200);
            res.send({ ok: true, data: data, message: "success" });
            return;
        }
        else {
            throw new Error(error.message);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k;
    try {
        console.log("POST FEEDBACK");
        const supabase = (0, utils_1.createClient)({ req, res });
        const userId = (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.user_id;
        const completionId = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.completion_id;
        const chatId = (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.chat_id;
        const ratingId = (_g = req === null || req === void 0 ? void 0 : req.body) === null || _g === void 0 ? void 0 : _g.rating_id;
        const rating = (_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.rating;
        const prompt = (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.prompt;
        const completion = (_k = req === null || req === void 0 ? void 0 : req.body) === null || _k === void 0 ? void 0 : _k.completion;
        console.log(chatId);
        if (!chatId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "Invalid Request",
            });
            return;
        }
        if (!userId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "Authentication Error",
            });
            return;
        }
        if (!ratingId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Rating ID provided",
            });
            return;
        }
        if (!rating) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Rating provided",
            });
            return;
        }
        if (!completionId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Completion ID provided",
            });
            return;
        }
        if (!completion) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Completion provided",
            });
            return;
        }
        if (!prompt) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Prompt provided",
            });
            return;
        }
        const { data, error } = yield supabase
            .from("completion_feedback")
            .upsert([
            {
                user_id: userId,
                id: ratingId,
                chat_id: chatId,
                completion_id: completionId,
                created_at: new Date().toISOString(),
                rating,
                prompt,
                completion,
            },
        ])
            .select()
            .single();
        if (data) {
            res.status(200);
            res.send({ ok: true, data: data, message: "success" });
            return;
        }
        if (error) {
            throw new Error(error.message);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
router.route("/").delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o;
    try {
        console.log("DELETE FEEDBACK");
        const supabase = (0, utils_1.createClient)({ req, res });
        const userId = (_l = req === null || req === void 0 ? void 0 : req.query) === null || _l === void 0 ? void 0 : _l.user_id;
        const completionId = (_m = req === null || req === void 0 ? void 0 : req.query) === null || _m === void 0 ? void 0 : _m.completion_id;
        const chatId = (_o = req === null || req === void 0 ? void 0 : req.query) === null || _o === void 0 ? void 0 : _o.chat_id;
        if (!userId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "Authentication Error",
            });
            return;
        }
        if (!completionId) {
            res.status(400);
            res.send({
                ok: false,
                data: [],
                message: "No Completions ID provided",
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
        const { error } = yield supabase
            .from("completion_feedback")
            .delete()
            .eq("user_id", userId)
            .eq("completion_id", completionId)
            .eq("chat_id", chatId)
            .single();
        if (!error) {
            res.status(200);
            res.send({ ok: true, data: [], message: "success" });
            return;
        }
        if (error) {
            throw new Error(error.message);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: "Something went wrong" });
        return;
    }
}));
exports.default = router;
