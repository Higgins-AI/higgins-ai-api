import { ChromaClient } from "chromadb";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const chromaClient = new ChromaClient({
  path: process.env.CHROMADB_PUBLIC_URL,
});

router.route("/").get(async (req, res) => {
  const collections = await chromaClient.listCollections();
  if (collections && collections.length > 0) {
    res.send(collections);
    return;
  }
  res.send("No collections found");
  return;
});

export default router;
