import express from 'express';
import dotenv from 'dotenv';
import {Request, Response} from 'express'
import {CompletionPostRequest, PostCompletionResponse} from "../../models/completion.model";
import {
  fetchChat,
  fetchChatByUserIdAndChatId, fetchChatByUserIdAndChatIdAndCompletionId,
  fetchIndustryForName,
  upsertChatCompletion
} from "../../service/completion.service";
import {generatePrompt} from "../../lib/openAi";
import {getRelatedDocs} from "../../lib/chroma";
import {customGoogleSearch} from "../../lib/google-search";

dotenv.config();

const router = express.Router();

router.route('/').get(async (req: Request<any, any, any, { user_id: string; chat_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET COMPLETIONS`);
    const userId = req.query.chat_id;
    const chatId = req.query.chat_id;
    if (!userId) {
      res.status(400);
      res.send({ok: false, data: [], message: 'Authentication Error'});
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ok: false, data: [], message: 'No Chat Input Provided'});
      return;
    }
    const {data, error} = await fetchChatByUserIdAndChatId({req, res}, userId, chatId)
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ok: false, data: [], message: error.message});
      return;
    }
    res.status(200);
    res.send({ok: true, data: data, message: 'success'});
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/').post(async (req: Request<any, any, CompletionPostRequest>, res: Response<any, PostCompletionResponse>) => {
  try {
    console.log(`USER_ID: ${req.body?.user_id} – POST COMPLETION`);
    const userInput = req.body?.user_input;
    const messages = req.body?.messages ?? [];
    const userId = req.body?.user_id;
    const chatId = req.body?.chat_id;
    if (!userInput) {
      res.status(400).json({ok: false, data: [], message: 'No User Input Provided'});
      return;
    }
    if (!userId) {
      res.status(401).json({ok: false, data: [], message: 'Authentication Error'});
      return;
    }
    if (!chatId) {
      res.status(400).json({ok: false, data: [], message: 'Invalid Request'});
      return;
    }
    const {data: chat, error: chatError} = await fetchChat({req, res}, userId, chatId)

    if (chatError) {
      console.log(chatError);
      res.status(500);
      res.send({ok: false, data: [], message: chatError.message});
      return;
    }
    const industryName = chat.industry ?? '';
    const {data: industry, error: industryError} = await fetchIndustryForName({req, res}, userId, industryName)
    if (industryError) {
      console.log(industryError);
      // res.status(500);
      // res.send({ ok: false, data: [], message: industryError.message });
      // return;
    }

    const docs = await getRelatedDocs(
      userInput,
      industry?.name?.toLowerCase() === 'all'
        ? 'all-industries'
        : industry?.name?.toLowerCase() || ''
    );
    const supportingDocs = docs?.at(0)?.map((doc) => doc?.replace('\n', ' '));
    console.log(supportingDocs);
    const googleSearchResults = await customGoogleSearch(userInput);
    console.log(googleSearchResults);
    const response = await generatePrompt(messages, userInput, supportingDocs, industry?.system_directive, industry?.completion_temperature, googleSearchResults)
    if (response.status === 200) {
      const completionData = response.data;
      const {data, error} = await upsertChatCompletion({
        req,
        res
      }, userId, chatId, completionData, userInput, supportingDocs)

      if (error) {
        console.log(error);
        res.status(500).json({ok: false, data: [], message: error.message});
        return;
      }
      res.status(200).json({ok: true, data: data, message: 'success'});
    } else {
      console.log(response.statusText);
      res.status(500).json({ok: false, data: [], message: response.statusText});
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET COMPLETION`);
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;
    const completionId = req?.params?.id;
    if (!userId) {
      res.status(400);
      res.send({ok: false, data: [], message: 'Authentication Error'});
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ok: false, data: [], message: 'No Chat Input Provided'});
      return;
    }

    const {data, error} = await fetchChatByUserIdAndChatIdAndCompletionId({req, res}, userId, chatId, completionId)
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ok: false, data: [], message: error.message});
      return;
    }
    res.status(200);
    res.send({ok: true, data: data, message: 'success'});
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ok: false, data: [], message: 'Something went wrong'});
    return;
  }
});

export default router;
