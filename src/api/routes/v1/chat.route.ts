import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { createClient } from "../../utils/utils";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    console.log("GET CHATS");

    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User ID provided" });
      return;
    }
    const { data: chats, error: chatsError } = await supabase
      .from("chat")
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
    console.log("POST CHAT");

    const supabase = createClient({ req, res });
    let title = (req?.body?.title as string | undefined) || "New Chat";
    const userId = req?.body?.user_id as string | undefined;
    const createdAt = req?.body?.created_at as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;

    if (!userId || !chatId) {
      res.status(400);
      res.send({
        ok: false,
        data: [],
        message: "No User ID or Chat ID provided",
      });
      return;
    }
    const { data: count, error: countError } = await supabase
      .from("chat")
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
      .from("chat")
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
    console.log("GET CHAT");

    const supabase = createClient({ req, res });
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.params?.id;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No User ID provided" });
      return;
    }
    const { data: chats, error: chatsError } = await supabase
      .from("chat")
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
    console.log("PATCH CHAT");

    const supabase = createClient({ req, res });
    const title = req?.body?.title as string | undefined;
    const chatId = req?.params?.id;

    if (!title) {
      res.status(400);
      res.send({ ok: false, data: [], message: "No New Title provided" });
      return;
    }
    const { data: chat, error: chatError } = await supabase
      .from("chat")
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
    console.log("DELETE CHAT");
    const supabase = createClient({ req, res });
    const chatId = req?.params?.id;

    const { error } = await supabase
      .from("chat")
      .delete()
      .eq("id", chatId)
      .single();
    if (error) {
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      console.log(res);
      return;
    }
    res.status(200);
    res.send({ ok: true, data: [], message: "success" });
    console.log(res);
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });

    return;
  }
});

export default router;
