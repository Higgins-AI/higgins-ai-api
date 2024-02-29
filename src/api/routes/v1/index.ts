import express from "express";
import devRoute from "./devData.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.use("/dev-data", devRoute);

export default router;
