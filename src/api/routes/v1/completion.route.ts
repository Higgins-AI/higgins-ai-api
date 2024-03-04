import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import axios from "axios";
import { createClient } from "../../utils/utils";
import { OpenAiCompletion } from "../../../types/types";
dotenv.config();

const router = express.Router();

const chromaClient = new ChromaClient({
  path: process.env.CHROMADB_URL,
});
const openAIEmbedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
});

router.route("/").get(async (req, res) => {
  try {
    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User ID Provided" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Chat Input Provided" });
      return;
    }
    const { data, error } = await supabase
      .from("chat_completion")
      .select()
      .eq("user_id", userId)
      .eq("chat_id", chatId)
      .order("created", { ascending: true });
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      return;
    }
    console.log(data);
    res.status(200);
    res.send({ ok: true, data: data, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").post(async (req, res) => {
  try {
    const supabase = createClient({ req, res });
    const userInput = req?.body?.user_input as string | undefined;
    const messages =
      (req?.body?.messages as
        | { role: string; content: string }[]
        | undefined) || [];
    const userId = req?.body?.user_id as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;
    console.log(messages);
    if (!userInput) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User Input Provided" });
      return;
    }
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User ID Provided" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Chat ID Provided" });
      return;
    }
    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          ...messages,
          {
            role: "system",
            content: "You are a helpful assistant",
          },
          { role: "user", content: userInput },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    if (response.statusText === "OK") {
      const completionData = response.data as OpenAiCompletion;
      const { data, error } = await supabase
        .from("chat_completion")
        .upsert({
          id: completionData.id,
          object: completionData.object,
          created: completionData.created,
          model: completionData.model,
          role: completionData.choices[0].message.role,
          message: completionData.choices[0].message.content,
          finish_reason: completionData.choices[0].finish_reason,
          prompt_tokens: completionData.usage.prompt_tokens,
          completion_tokens: completionData.usage.completion_tokens,
          total_tokens: completionData.usage.total_tokens,
          user_id: userId,
          chat_id: chatId,
          prompt: userInput,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: error.message });
        return;
      }
      console.log(data);
      res.status(200);
      res.send({ ok: true, data: data, message: "success" });
    } else {
      console.log(response.statusText);
      res.status(500);
      res.send({ ok: false, data: [], message: response.statusText });
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;
    const completionId = req?.params?.id;
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User ID Provided" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Chat Input Provided" });
      return;
    }
    const { data, error } = await supabase
      .from("chat_completion")
      .select()
      .eq("user_id", userId)
      .eq("chat_id", chatId)
      .eq("id", completionId)
      .single();
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: data, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

export default router;
