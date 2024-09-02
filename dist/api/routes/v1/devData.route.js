"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testData = [{ id: 1 }, { id: 2 }, { id: 3 }];
const router = express_1.default.Router();
router.route("/").get((req, res) => {
    res.send(testData);
});
exports.default = router;
