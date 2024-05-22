import express from "express";
import dotenv from "dotenv";
import {getAllCollections} from "../../lib/chroma";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req, res) => {
  const collections = await getAllCollections();
  if (collections && collections.length > 0) {
    res.status(200).send(collections);
  }
});

export default router;
