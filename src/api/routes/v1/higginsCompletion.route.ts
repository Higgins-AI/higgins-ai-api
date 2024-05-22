import express from 'express';
import dotenv from 'dotenv';
import {getRelatedDocs} from "../../lib/chroma";
import {fetchHigginsChatCompletion, insertHigginsChatCompletion} from "../../service/higginsCompletion.service";
import {HigginsCompletionPostRequestBody} from "../../models/higginsCompletion.model";
import {generatePrompt} from "../../lib/openAi";
import {fetchChatByUserIdAndChatIdAndCompletionId} from "../../service/completion.service";
dotenv.config();

const router = express.Router();

router.route('/').get(async (req: express.Request<any, any, any, { user_id: string; chat_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req.query.user_id} – GET HIGGINS COMPLETIONS`);
    const userId = req.query.user_id;
    const chatId = req.query.chat_id;
    if (!userId) {
      res.status(401)
        .json({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({ ok: false, data: [], message: 'No Chat Input Provided' });
      return;
    }

    const { data, error } = await fetchHigginsChatCompletion({ req, res }, userId, chatId)
    if (error) {
      console.log(error);
      res.status(500)
        .json({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200)
      .json({ ok: true, data: data, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

router.route('/').post(async (req: express.Request<any, any, HigginsCompletionPostRequestBody>, res) => {
  try {
    console.log(`USER_ID: ${req?.body?.user_id} – POST HIGGINS COMPLETION`);
    const {
      system_directive: systemDirective,
      user_input: userInput,
      user_id: userId,
      chat_id: chatId,
      temperature,
      organization,
    } = req.body

    const messages = req.body.messages ?? []

    if (!userInput) {
      res.status(400)
        .json({ ok: false, data: [], message: 'No User Input Provided' });
      return;
    }
    if (!userId) {
      res.status(401)
        .json({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({ ok: false, data: [], message: 'Invalid Request' });
      return;
    }
    if (!organization) {
      res.status(400)
        .json({ ok: false, data: [], message: 'No Organization Provided' });
      return;
    }
    if (isNaN(+temperature)) {
      res.status(400)
        .json({ ok: false, data: [], message: `Invalid temperature [${temperature}] provided` });
      return;
    }

    const docs = await getRelatedDocs(userInput, organization);
    const supportingDocs = docs?.at(0)?.map((doc) => doc?.replace('\n', ' '));
    const defaultSystemDirective = `
        Your name is Higgins. You are a helpful assistant for the company ${organization}. 
        You may be provided with some supporting context that you can use to help you respond to the user's next prompt. 
        If the supporting context does not closely relate to the user's prompt, ignore it as you formulate a response. 
        If the user's prompt refers to any previous messages, ignore the supporting context as you formulate a response. 
        The supporting context will be in the following format: 
            <context>supporting context</context>.
            <context>${JSON.stringify(supportingDocs)}</context>
    `;

    const directive = systemDirective ?? defaultSystemDirective
    const response = await generatePrompt(messages, userInput, supportingDocs, directive, +temperature)
    if (response.status === 200) {
      const completionData = response.data;

      const { data, error } = await insertHigginsChatCompletion({ req, res }, userId, chatId, userInput, completionData, supportingDocs)
      if (error) {
        console.log(error);
        res.status(500)
          .json({ ok: false, data: [], message: error.message });
        return;
      }
      res.status(200)
        .json({ ok: true, data: data, message: 'success' });
    } else {
      console.log(response.statusText);
      res.status(500)
        .json({ ok: false, data: [], message: response.statusText });
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET HIGGINS COMPLETION`);
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.params?.id as string | undefined;
    const completionId = req?.params?.id;
    if (!userId) {
      res.status(401)
        .json({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400)
        .json({ ok: false, data: [], message: 'No Chat Input Provided' });
      return;
    }

    const { data, error } = await fetchChatByUserIdAndChatIdAndCompletionId({ req, res }, userId, chatId, completionId)
    if (error) {
      console.log(error);
      res.status(500)
        .json({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200)
      .json({ ok: true, data: data, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500)
      .json({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

export default router;
