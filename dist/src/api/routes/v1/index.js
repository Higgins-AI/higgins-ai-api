"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const completion_route_1 = __importDefault(require("./completion.route"));
const collection_route_1 = __importDefault(require("./collection.route"));
const chat_route_1 = __importDefault(require("./chat.route"));
const higginsChat_route_1 = __importDefault(require("./higginsChat.route"));
const higginsCompletion_route_1 = __importDefault(require("./higginsCompletion.route"));
const feedback_route_1 = __importDefault(require("./feedback.route"));
const router = express_1.default.Router();
/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
router.use("/completion", completion_route_1.default);
router.use("/collection", collection_route_1.default);
router.use("/chat", chat_route_1.default);
router.use("/higgins-chat", higginsChat_route_1.default);
router.use("/higgins-completion", higginsCompletion_route_1.default);
router.use("/feedback", feedback_route_1.default);
exports.default = router;
