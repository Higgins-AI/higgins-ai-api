import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import axios from "axios";
import { createClient } from "../../utils/utils";
import { OpenAiCompletion } from "../../../types/types";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

const chromaClient = new ChromaClient({
  path: process.env.CHROMADB_URL,
});
const openAIEmbedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
});

const getRelatedDocs = async (inputString: string, organization: string) => {
  const collection = await chromaClient.getCollection({
    name: organization,
    embeddingFunction: openAIEmbedder,
  });
  const documents = await collection.query({
    queryTexts: inputString,
    nResults: 5,
  });
  if (!documents.documents) {
    return undefined;
  }
  return documents.documents;
};

router.route("/").get(async (req, res) => {
  try {
    console.log("GET HIGGINS COMPLETIONS");
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Chat Input Provided" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase
      .from("higgins_chat_completion")
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
    console.log("POST HIGGINS COMPLETION");
    const systemDirective = req?.body?.system_directive as string | undefined;
    const userInput = req?.body?.user_input as string | undefined;
    const messages =
      (req?.body?.messages as
        | { role: string; content: string }[]
        | undefined) || [];
    const userId = req?.body?.user_id as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;
    const temperature = req?.body?.chat_id as string | undefined;
    const organization = req?.body?.organization as string | undefined;
    if (!userInput) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User Input Provided" });
      return;
    }
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Invalid Request" });
      return;
    }
    if (!organization) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Organization Provided" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);

    const docs = await getRelatedDocs(userInput, organization);
    const supportingDocs = docs?.at(0)?.map((doc) => doc?.replace("\n", " "));
    const defaultSystemDirective = `Your name is Higgins. You are a helpful assistant for the company ${organization}. I will provide you some supporting documents that you can use to help you respond to the user's next prompt. If the supporting documents do not closely relate to the user's prompt, ignore them as you formulate a response. If the user's prompt refers to any previous messages, ignore the supporting documents as you formulate a response. The following text is the supporting documents: ${supportingDocs}`;

    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          ...messages,
          {
            role: "system",
            content: systemDirective
              ? systemDirective + supportingDocs
              : defaultSystemDirective,
          },
          { role: "user", content: userInput },
        ],
        temperature: temperature ? Number(temperature) : 0.7,
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
        .from("higgins_chat_completion")
        .insert({
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
          documents: supportingDocs as string[] | null | undefined,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: error.message });
        return;
      }
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
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.params?.id as string | undefined;
    const completionId = req?.params?.id;
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No Chat Input Provided" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase
      .from("higgins_chat_completion")
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
