"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const devData_route_1 = __importDefault(require("./devData.route"));
const completions_route_1 = __importDefault(require("./completions.route"));
const collections_route_1 = __importDefault(require("./collections.route"));
const router = express_1.default.Router();
/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
router.use("/dev-data", devData_route_1.default);
router.use("/completions", completions_route_1.default);
router.use("/collections", collections_route_1.default);
exports.default = router;
