import express from "express";
import devRoute from "./dev.route";
import completionRoute from "./completion.route";
import collectionRoute from "./collection.route";
import chatRoute from "./chat.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.use("/dev", devRoute);
router.use("/completion", completionRoute);
router.use("/collection", collectionRoute);
router.use("/chat", chatRoute);

export default router;
