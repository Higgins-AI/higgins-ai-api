import express from "express";
import devRoute from "./dev.route";
import completionsRoute from "./completions.route";
import collectionsRoute from "./collections.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.use("/dev", devRoute);
router.use("/completions", completionsRoute);
router.use("/collections", collectionsRoute);

export default router;
