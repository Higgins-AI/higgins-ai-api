import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

const chromaClient = new ChromaClient({
  path: process.env.CHROMADB_URL,
});
const openAIEmbedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
});
import { createServerClient } from "@supabase/ssr";
import { Database } from "../../../types/supabase.types";

const createClient = (context: { req: Request; res: Response }) => {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        // get: (key) => {
        //   const cookies = context.req.cookies;
        //   const cookie = cookies[key] ?? "";
        //   return decodeURIComponent(cookie);
        // },
        // set: (key, value, options) => {
        //   if (!context.res) return;
        //   context.res.cookie(key, encodeURIComponent(value), {
        //     ...options,
        //     sameSite: "Lax",
        //     httpOnly: true,
        //   });
        // },
        // remove: (key, options) => {
        //   if (!context.res) return;
        //   context.res.cookie(key, "", { ...options, httpOnly: true });
        // },
      },
    }
  );
};

router.route("/").get(async (req, res) => {
  const supabase = createClient({ req, res });
  const { data, error } = await supabase.from("Development").select();
  console.log(data);

  res.send(data);
});

export default router;
