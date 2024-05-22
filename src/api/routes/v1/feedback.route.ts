import express from "express";
import dotenv from "dotenv";
import {deleteFeedback, fetchCompletionFeedback, upsertFeedback} from "../../service/feedback.service";
import {PostFeedbackRequestBody} from "../../models/feedback.model";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req: express.Request<any, any, any, { user_id: string; completion_id: string; chat_id: string}>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – GET FEEDBACK`);
    const userId = req.query.user_id;
    const completionId = req.query.completion_id;
    const chatId = req.query.chat_id;

    if (!userId) {
      res.status(401)
        .send({
        ok: false,
        data: undefined,
        message: "Authentication Error",
      });
      return;
    }
    if (!completionId) {
      res.status(400)
        .json({
        ok: false,
        data: undefined,
        message: "No Completions ID provided",
      });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({
        ok: false,
        data: undefined,
        message: "Invalid Request",
      });
      return;
    }

    const { data, error } = await fetchCompletionFeedback({ req, res }, userId, completionId, chatId)
    if (!error) {
      res.status(200)
        .json({ ok: true, data: data, message: "success" });
      return;
    } else {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").post(async (req: express.Request<any, any, PostFeedbackRequestBody>, res) => {
  try {
    console.log(`USER_ID: ${req.body.user_id} – POST FEEDBACK`);
    const {
      user_id: userId,
      completion_id: completionId,
      chat_id: chatId,
      rating_id: ratingId,
      rating,
      prompt,
      completion,
    } = req.body

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

    const { data, error } = await upsertFeedback({ req, res }, userId, ratingId, chatId, completionId, rating, prompt, completion)
    if (data) {
      res.status(200)
        .json({ ok: true, data: data, message: "success" });
      return;
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/").delete(async (req: express.Request<any, any, any, { user_id: string; completion_id: string; chat_id: string}>, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – DELETE FEEDBACK`);
    const {
      user_id: userId,
      chat_id: chatId,
      completion_id: completionId,
    } = req.query

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

    const { error } = await deleteFeedback({ req, res }, userId, completionId, chatId)
    if (!error) {
      res.status(200)
        .json({ ok: true, data: [], message: "success" });
      return;
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

export default router;
