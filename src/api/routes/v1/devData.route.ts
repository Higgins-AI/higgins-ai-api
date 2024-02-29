import express from "express";

const testData = [{ id: 1 }, { id: 2 }, { id: 3 }];
const router = express.Router();
router.route("/").get((req, res) => {
  res.send(testData);
});

export default router;
