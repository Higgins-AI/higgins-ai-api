import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import {
  createClient,
  customGoogleSearch,
  getRelatedDocs,
} from '../../utils/utils';
import { OpenAiCompletion } from '../../../types/types';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET COMPLETIONS`);
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.query?.chat_id as string | undefined;
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'No Chat Input Provided' });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: 'authenticated' },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase
      .from('chat_completion')
      .select()
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .order('created', { ascending: true });
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: data, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

router.route('/').post(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.body?.user_id} – POST COMPLETION`);
    const userInput = req?.body?.user_input as string | undefined;
    const messages =
      (req?.body?.messages as
        | { role: string; content: string }[]
        | undefined) || [];
    const userId = req?.body?.user_id as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;
    if (!userInput) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'No User Input Provided' });
      return;
    }
    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'Invalid Request' });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: 'authenticated' },
      process.env.SUPABASE_JWT_SECRET!
    );

    const supabase = createClient({ req, res }, token);
    const { data: chat, error: chatError } = await supabase
      .from('chat')
      .select()
      .eq('id', chatId)
      .single();
    if (chatError) {
      console.log(chatError);
      res.status(500);
      res.send({ ok: false, data: [], message: chatError.message });
      return;
    }
    const industryName = chat.industry || '';
    const { data: industry, error: industryError } = await supabase
      .from('industry')
      .select()
      .eq('name', industryName)
      .single();
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
    const response = await axios.post<OpenAiCompletion>(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          ...messages,
          {
            role: 'system',
            content:
              (industry?.system_directive ||
                `Your name is Higgins. You are a helpful AI assistant. You may be provided with some supporting context that you can use to help you respond to the user's next prompt. If the supporting context does not closely relate to the user's prompt, ignore it as you formulate a response. If the user's prompt refers to any previous messages, ignore the supporting context as you formulate a response. Your response should always be in markdown format. The supporting context will be in the following format: <context>supporting context</context>. You may also be provided an array of touples containing display links and links. If you are provided this array, tell the user that they may find more information about their question by checking out the links. The display link should be the text that is shown to the user, and the link url should be the link in the touple. The array of links will be in the following format: <linksArray>[array]</linksArray> A touple in this array will have the following format: '{displayLink: "example.com", link: "https://example.com"}`) +
              `

            <context>${JSON.stringify(supportingDocs)}</context>
            <linksArray>${JSON.stringify(googleSearchResults)}</linksArray>
            `,
          },
          { role: 'user', content: userInput },
        ],
        temperature: industry?.completion_temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    if (response.status === 200) {
      const completionData = response.data;
      const { data, error } = await supabase
        .from('chat_completion')
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
      res.send({ ok: true, data: data, message: 'success' });
    } else {
      console.log(response.statusText);
      res.status(500);
      res.send({ ok: false, data: [], message: response.statusText });
      return;
    }
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: 'Something went wrong' });
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
      res.send({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    if (!chatId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'No Chat Input Provided' });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: 'authenticated' },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase
      .from('chat_completion')
      .select()
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .eq('id', completionId)
      .single();
    if (error) {
      console.log(error);
      res.status(500);
      res.send({ ok: false, data: [], message: error.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: data, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

export default router;
