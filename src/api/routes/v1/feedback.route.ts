import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { createClient } from "../../utils/utils";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    console.log("GET FEEDBACK");
    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;
    const completionId = req?.query?.completion_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({
        ok: false,
        data: undefined,
        message: "Authentication Error",
      });
      return;
    }
    if (!completionId) {
      res.status(400);
      res.send({
        ok: false,
        data: undefined,
        message: "No Completions ID provided",
      });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({
        ok: false,
        data: undefined,
        message: "Invalid Request",
      });
      return;
    }
    const { data, error } = await supabase
      .from("completion_feedback")
      .select()
      .eq("user_id", userId)
      .eq("completion_id", completionId)
      .eq("chat_id", chatId);
    console.log(data);
    if (!error) {
      res.status(200);
      res.send({ ok: true, data: data, message: "success" });
      return;
    } else {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").post(async (req, res) => {
  try {
    console.log("POST FEEDBACK");
    const supabase = createClient({ req, res });
    const userId = req?.body?.user_id as string | undefined;
    const completionId = req?.body?.completion_id as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;
    const ratingId = req?.body?.rating_id as string | undefined;
    const rating = req?.body?.rating as string | undefined;
    const prompt = req?.body?.prompt as string | undefined;
    const completion = req?.body?.completion as string | undefined;
    console.log(chatId);
    if (!chatId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "Invalid Request",
      });
      return;
    }
    if (!userId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "Authentication Error",
      });
      return;
    }
    if (!ratingId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Rating ID provided",
      });
      return;
    }
    if (!rating) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Rating provided",
      });
      return;
    }
    if (!completionId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Completion ID provided",
      });
      return;
    }
    if (!completion) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Completion provided",
      });
      return;
    }
    if (!prompt) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Prompt provided",
      });
      return;
    }
    const { data, error } = await supabase
      .from("completion_feedback")
      .upsert([
        {
          user_id: userId,
          id: ratingId,
          chat_id: chatId,
          completion_id: completionId,
          created_at: new Date().toISOString(),
          rating,
          prompt,
          completion,
        },
      ])
      .select()
      .single();
    if (data) {
      res.status(200);
      res.send({ ok: true, data: data, message: "success" });
      return;
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").delete(async (req, res) => {
  try {
    console.log("DELETE FEEDBACK");
    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;
    const completionId = req?.query?.completion_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "Authentication Error",
      });
      return;
    }
    if (!completionId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No Completions ID provided",
      });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "Invalid Request",
      });
      return;
    }
    const { error } = await supabase
      .from("completion_feedback")
      .delete()
      .eq("user_id", userId)
      .eq("completion_id", completionId)
      .eq("chat_id", chatId)
      .single();
    if (!error) {
      res.status(200);
      res.send({ ok: true, data: [], message: "success" });
      return;
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

export default router;
