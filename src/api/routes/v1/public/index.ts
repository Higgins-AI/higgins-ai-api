import express from "express";
import completionRoute from "./completion.route";
import collectionRoute from "./collection.route";
import chatRoute from "./chat.route";
import higginsChatRoute from "./higginsChat.route";
import higginsCompletionRoute from "./higginsCompletion.route";
import feedbackRoute from "./feedback.route";
import organizationRoute from "./organizations.route";

const router = express.Router();

/**
 * GET v1/public/status
 */
router.get("/status", (req, res) => res.send("PUBLIC OK"));
router.use("/completion", completionRoute);
router.use("/collection", collectionRoute);
router.use("/chat", chatRoute);
router.use("/higgins-chat", higginsChatRoute);
router.use("/higgins-completion", higginsCompletionRoute);
router.use("/feedback", feedbackRoute);
router.use("/organization", organizationRoute);

export default router;
