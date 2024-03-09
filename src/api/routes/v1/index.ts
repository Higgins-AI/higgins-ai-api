import express from "express";
import completionRoute from "./completion.route";
import collectionRoute from "./collection.route";
import chatRoute from "./chat.route";
import higginsChatRoute from "./higginsChat.route";
import higginsCompletionRoute from "./higginsCompletion.route";
import feedbackRoute from "./feedback.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
router.use("/completion", completionRoute);
router.use("/collection", collectionRoute);
router.use("/chat", chatRoute);
router.use("/higgins-chat", higginsChatRoute);
router.use("/higgins-completion", higginsCompletionRoute);
router.use("/feedback", feedbackRoute);

export default router;
