import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { createClient } from "../../../utils/utils";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET PUBLIC CHATS`);

    const userId = req?.query?.user_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);

    const { data: chats, error: chatsError } = await supabase
      .from("public_chat")
      .select()
      .eq("user_id", userId);

    if (chatsError) {
      res.status(500);
      res.send({ ok: false, data: [], message: chatsError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: chats, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").post(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.body?.user_id} – POST PUBLIC CHAT`);
    let title = (req?.body?.title as string | undefined) || "New Chat";
    const userId = req?.body?.user_id as string | undefined;
    const createdAt = req?.body?.created_at as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "Authentication Error",
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
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data: count, error: countError } = await supabase
      .from("public_chat")
      .select()
      .eq("user_id", userId)
      .like("title", `%${title}%`);
    if (countError) {
      res.status(500);
      res.send({ ok: false, data: [], message: countError.message });
      return;
    }
    if (count && count.length > 1) {
      title += ` ${count.length}`;
    }
    const { data: newChat, error: newChatError } = await supabase
      .from("public_chat")
      .upsert({ id: chatId, created_at: createdAt, user_id: userId, title })
      .select()
      .single();
    if (newChatError) {
      res.status(500);
      res.send({ ok: false, data: [], message: newChatError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: newChat, message: "success" });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET PUBLIC CHAT`);

    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.params?.id;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data: chats, error: chatsError } = await supabase
      .from("public_chat")
      .select()
      .eq("user_id", userId)
      .eq("id", chatId)
      .single();
    if (chatsError) {
      res.status(500);
      res.send({ ok: false, data: [], message: chatsError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: chats, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/:id").patch(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.body?.user_id} – PATCH PUBLIC CHAT`);

    const title = req?.body?.title as string | undefined;
    const chatId = req?.params?.id;
    const userId = req?.body?.user_id as string | undefined;

    if (!title) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Invalid Request" });
      return;
    }
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data: chat, error: chatError } = await supabase
      .from("public_chat")
      .update({ title })
      .eq("id", chatId)
      .select()
      .single();
    if (chatError) {
      res.status(500);
      res.send({ ok: false, data: [], message: chatError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: chat, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/:id").delete(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – DELETE PUBLIC CHAT`);
    const chatId = req?.params?.id;
    const userId = req?.query?.user_id;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);

    const { error } = await supabase
      .from("public_chat")
      .delete()
      .eq("id", chatId)
      .eq("user_id", userId)
      .single();
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: [], message: "success" });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });

    return;
  }
});

export default router;
