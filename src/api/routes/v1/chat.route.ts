import express from 'express';
import dotenv from 'dotenv';
import {
  deleteChatForId,
  fetchChatforIdAndUserId,
  fetchChatForUserId,
  fetchChatForUserIdAndIndustry,
  fetchChatForUserIdAndIndustryLikeTitle, updateChatTitle, upsertChat
} from "../../service/chat.service";
import {PatchChatRequestBody, PostChatRequestBody} from "../../models/chat.model";

dotenv.config();

const router = express.Router();

router.route('/').get(async (req: express.Request<any, any, any, { user_id: string; industry: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – GET CHATS`);

    const userId = req.query.user_id;
    const industry = req.query.industry;

    console.log(industry);
    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: 'Authentication Error'});
      return;
    }

    if (!industry || industry.toLowerCase() === 'all') {
      const {data: chats, error: chatsError} = await fetchChatForUserId({req, res}, userId)
      if (chatsError) {
        res.status(500)
          .json({ok: false, data: [], message: chatsError.message});
        return;
      }
      res.status(200)
        .json({ok: true, data: chats, message: 'success'});
    } else {
      const {data: chats, error: chatsError} = await fetchChatForUserIdAndIndustry({req, res}, userId, industry)

      if (chatsError) {
        res.status(500)
          .json({ok: false, data: [], message: chatsError.message});
        return;
      }
      res.status(200)
        .json({ok: true, data: chats, message: 'success'});
    }
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/').post(async (req: express.Request<any, any, PostChatRequestBody>, res) => {
  try {

    const {
      title: reqTitle,
      user_id: userId,
      created_at: createdAt,
      chat_id: chatId,
      industry
    } = req.body
    let title = reqTitle
    console.log(`USER_ID: ${userId} – POST CHAT`);

    if (!userId) {
      res.status(401)
        .json({
          ok: false,
          data: [],
          message: 'Authentication Error',
        });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({
          ok: false,
          data: [],
          message: 'Invalid Request. No Chat ID provided.',
        });
      return;
    }
    if (!industry) {
      res.status(400)
        .json({
          ok: false,
          data: [],
          message: 'Invalid Request. No Industry provided.',
        });
      return;
    }

    const {data: count, error: countError} = await fetchChatForUserIdAndIndustryLikeTitle({
      req,
      res
    }, userId, industry, title)
    if (countError) {
      res.status(500)
        .json({ok: false, data: [], message: countError.message});
      return;
    }
    if (count && count.length > 1) {
      title += ` ${count.length}`;
    }
    const {data: newChat, error: newChatError} = await upsertChat({
      req,
      res
    }, userId, chatId, createdAt, title, industry)
    if (newChatError) {
      res.status(500)
        .json({ok: false, data: [], message: newChatError.message});
      return;
    }
    console.log(newChat);
    res.status(200)
      .json({ok: true, data: newChat, message: 'success'});
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/:id').get(async (req: express.Request<{ id: string }, any, any, { user_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET CHAT`);

    const userId = req.query.user_id;
    const chatId = req.params.id;

    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: 'Authentication Error'});
      return;
    }

    const {data: chats, error: chatsError} = await fetchChatforIdAndUserId({req, res}, userId, chatId)
    if (chatsError) {
      res.status(500)
      .json({ok: false, data: [], message: chatsError.message});
      return;
    }
    res.status(200)
    .json({ok: true, data: chats, message: 'success'});
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/:id').patch(async (req: express.Request<{ id: string }, any, PatchChatRequestBody>, res) => {
  try {
    console.log(`USER_ID: ${req.body.user_id} – PATCH CHAT`);

    const title = req.body.title;
    const userId = req.body.user_id;
    const chatId = req.params.id;

    if (!title) {
      res.status(400)
        .json({ok: false, data: [], message: 'Invalid Request'});
      return;
    }
    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: 'Authentication Error'});
      return;
    }

    const {data: chat, error: chatError} = await updateChatTitle({ req, res }, userId, chatId, title)
    if (chatError) {
      res.status(500)
        .json({ok: false, data: [], message: chatError.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: chat, message: 'success'});
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/:id').delete(async (req: express.Request<{ id: string }, any, any, { user_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – DELETE CHAT`);
    const chatId = req.params.id;
    const userId = req.query.user_id;

    if (!userId) {
      res.status(401)
        .json({ok: false, data: [], message: 'Authentication Error'});
      return;
    }

    const {error} = await deleteChatForId({ req, res }, userId, chatId)
    if (error) {
      res.status(500)
        .json({ok: false, data: [], message: error.message});
      return;
    }
    res.status(200)
      .json({ok: true, data: [], message: 'success'});
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

export default router;
