import express from "express";
import dotenv from "dotenv";
import {
  deleteHigginsChat,
  fetchHigginsChatForIdAndUserId,
  fetchHigginsChatForUserIdAndOrganization,
  fetchHigginsChatForUserIdAndOrganizationLikeTitle, updateHigginsChat, upsertHigginsChat
} from "../../service/higginsChat.service";
import {HigginsChatPostRequestBody} from "../../models/higginsChat.model";

dotenv.config();

const router = express.Router();

router.route("/").get(async (req: express.Request<any, any, any, { user_id: string; organization: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – GET HIGGINS CHATS`);
    const userId = req.query.user_id;
    const organization = req.query.organization;

    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: "Authentication Error"});
      return;
    }
    if (!organization) {
      res.status(400)
        .json({ok: false, data: [], message: "No Organization provided"});
      return;
    }

    const {data: chats, error: chatsError} = await fetchHigginsChatForUserIdAndOrganization({
      req,
      res
    }, userId, organization)
    if (chatsError) {
      res.status(500)
        .json({ok: false, data: [], message: chatsError.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: chats, message: "success"});
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: "Something went wrong"});
    return;
  }
});

router.route("/").post(async (req: express.Request<any, any, HigginsChatPostRequestBody>, res) => {
  try {
    console.log(`USER_ID: ${req?.body?.user_id} – POST HIGGINS CHAT`);
    const {
      title: reqTitle,
      user_id: userId,
      created_at: createdAt,
      chat_id: chatId,
      organization,
    } = req.body

    let title = reqTitle ?? "New Chat";

    if (!userId) {
      res.status(400)
        .json({
          ok: false,
          data: [],
          message: "Authentication Error",
        });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({
          ok: false,
          data: [],
          message: "Invalid Request",
        });
      return;
    }
    if (!organization) {
      res.status(400)
        .json({
          ok: false,
          data: [],
          message: "No Organization provided",
        });
      return;
    }

    const {data: count, error: countError} = await fetchHigginsChatForUserIdAndOrganizationLikeTitle({
      req,
      res
    }, userId, organization, title)
    if (countError) {
      res.status(500);
      res.send({ok: false, data: [], message: countError.message});
      return;
    }
    if (count && count.length > 1) {
      title += ` ${count.length}`;
    }
    const {data: newChat, error: newChatError} = await upsertHigginsChat({
      req,
      res
    }, userId, chatId, createdAt, organization, title)
    if (newChatError) {
      res.status(500)
        .json({ok: false, data: [], message: newChatError.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: newChat, message: "success"});
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: "Something went wrong"});
    return;
  }
});

router.route("/:id").get(async (req: express.Request<{ id: string }, any, any, { user_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – GET HIGGINS CHAT`);

    const userId = req.query.user_id;
    const chatId = req.params.id;

    if (!userId) {
      console.log("No User ID Provided");
      res.status(401)
        .json({ok: false, data: [], message: "Authentication Error"});
      return;
    }

    const {data: chats, error: chatsError} = await fetchHigginsChatForIdAndUserId({req, res}, userId, chatId)
    if (chatsError) {
      console.log(chatsError.message);
      res.status(500)
        .json({ok: false, data: [], message: chatsError.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: chats, message: "success"});
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: "Something went wrong"});
    return;
  }
});

router.route("/:id").patch(async (req: express.Request<{ id: string }, any, {
  title: string;
  user_id: string
}>, res) => {
  try {
    console.log(`USER_ID: ${req.body.user_id} – PATCH HIGGINS CHAT`);

    const title = req.body.title;
    const chatId = req.params.id;
    const userId = req.body.user_id;

    if (!title) {
      res.status(400)
        .json({ok: false, data: [], message: "Invalid Request"});
      return;
    }
    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: "Authentication Error"});
      return;
    }

    const {data: chat, error: chatError} = await updateHigginsChat({req, res}, userId, title, chatId)
    if (chatError) {
      res.status(500)
        .json({ok: false, data: [], message: chatError.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: chat, message: "success"});
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: "Something went wrong"});
    return;
  }
});

router.route("/:id").delete(async (req: express.Request<{ id: string }, any, any, { user_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – DELETE HIGGINS CHATS`);
    const chatId = req.params.id;
    const userId = req.query.user_id;

    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: "Authentication Error"});
      return;
    }

    const {error} = await deleteHigginsChat({req, res}, userId, chatId)
    if (error) {
      console.log(error);
      res.status(500)
        .json({ok: false, data: [], message: error.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: [], message: "success"});
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: "Something went wrong"});

    return;
  }
});

export default router;
