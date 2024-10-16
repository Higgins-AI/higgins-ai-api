import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { createClient, getRelatedDocs } from '../../utils/utils';
import { OpenAiCompletion, SuggestedPrompts } from '../../../types/types';
import jwt from 'jsonwebtoken';
dotenv.config();

const router = express.Router();

const chromaClient = new ChromaClient({
  path: process.env.CHROMADB_PRO_URL,
});
const openAIEmbedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY!,
});

// const getRelatedDocs = async (inputString: string, organization: string) => {
//   const collection = await chromaClient.getCollection({
//     name: organization,
//     embeddingFunction: openAIEmbedder,
//   });
//   const documents = await collection.query({
//     queryTexts: inputString,
//     nResults: 5,
//   });
//   if (!documents.documents) {
//     return undefined;
//   }
//   return documents.documents;
// };

router.route('/').get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET HIGGINS COMPLETIONS`);
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
    const token = jwt.sign({ sub: userId, role: 'authenticated' }, process.env.SUPABASE_JWT_SECRET!);
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase.from('higgins_chat_completion').select().eq('user_id', userId).eq('chat_id', chatId).order('created', { ascending: true });
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
    console.log(`USER_ID: ${req?.body?.user_id} – POST HIGGINS COMPLETION`);
    const systemDirective = req?.body?.system_directive as string | undefined;
    const userInput = req?.body?.user_input as string | undefined;
    const messages = (req?.body?.messages as { role: string; content: string }[] | undefined) || [];
    const userId = req?.body?.user_id as string | undefined;
    const chatId = req?.body?.chat_id as string | undefined;
    const temperature = req?.body?.chat_id as string | undefined;
    const organization = req?.body?.organization as string | undefined;
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
    if (!organization) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'No Organization Provided' });
      return;
    }
    const token = jwt.sign({ sub: userId, role: 'authenticated' }, process.env.SUPABASE_JWT_SECRET!);
    const supabase = createClient({ req, res }, token);

    const docs = await getRelatedDocs(userInput, organization);
    const supportingDocs = docs?.at(0)?.map((doc) => doc?.replace('\n', ' '));
    console.log(supportingDocs);
    const defaultSystemDirective = `Your name is Higgins. You are a helpful assistant for the company ${organization}. You may be provided with some supporting context that you can use to help you respond to the user's next prompt. If the supporting context does not closely relate to the user's prompt, ignore it as you formulate a response. If the user's prompt refers to any previous messages, ignore the supporting context as you formulate a response. The supporting context will be in the following format: <context>supporting context</context>.
    
    <context>${JSON.stringify(supportingDocs)}</context>`;

    const response = await axios.post<OpenAiCompletion>(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          ...messages,
          {
            role: 'system',
            content: systemDirective ? systemDirective + supportingDocs : defaultSystemDirective,
          },
          { role: 'user', content: userInput },
        ],
        temperature: temperature ? Number(temperature) : 0.7,
        tools: [
          {
            type: 'function',
            function: {
              name: 'get_recommended_prompts',
              description:
                'Get recommended prompts for the user to use to continue the conversation or help the user provide you with more information to help you formulate a response. Only suggest prompts that will help you formulate a response to the user. Each prompt should be between 2 to 5 words in length. You may provide between 1 and 4 prompts.',
              parameters: {
                type: 'object',
                properties: {
                  content: {
                    type: 'string',
                    description: 'The conversational response to the user.',
                  },
                  prompt_1: {
                    type: 'object',
                    description: 'The first recommended prompt.',
                    properties: {
                      id: {
                        type: 'number',
                        description: 'unique identifier for this prompt object',
                      },
                      label: {
                        type: 'string',
                        description: 'The label for the button that the user will interact with',
                      },
                      value: {
                        type: 'string',
                        description: 'The value that will be used as the actual prompt when the button is clicked',
                      },
                    },
                    required: ['id', 'label', 'value'],
                  },
                  prompt_2: {
                    type: 'object',
                    description: 'The second recommended prompt.',
                    properties: {
                      id: {
                        type: 'number',
                        description: 'unique identifier for this prompt object',
                      },
                      label: {
                        type: 'string',
                        description: 'The label for the button that the user will interact with',
                      },
                      value: {
                        type: 'string',
                        description: 'The value that will be used as the actual prompt when the button is clicked',
                      },
                    },
                    required: ['id', 'label', 'value'],
                  },
                  prompt_3: {
                    type: 'object',
                    description: 'The third recommended prompt.',
                    properties: {
                      id: {
                        type: 'number',
                        description: 'unique identifier for this prompt object',
                      },
                      label: {
                        type: 'string',
                        description: 'The label for the button that the user will interact with',
                      },
                      value: {
                        type: 'string',
                        description: 'The value that will be used as the actual prompt when the button is clicked',
                      },
                    },
                    required: ['id', 'label', 'value'],
                  },
                  prompt_4: {
                    type: 'object',
                    description: 'The fourth recommended prompt.',
                    properties: {
                      id: {
                        type: 'number',
                        description: 'unique identifier for this prompt object',
                      },
                      label: {
                        type: 'string',
                        description: 'The label for the button that the user will interact with',
                      },
                      value: {
                        type: 'string',
                        description: 'The value that will be used as the actual prompt when the button is clicked',
                      },
                    },
                    required: ['id', 'label', 'value'],
                  },
                },
                required: ['content', 'prompt_1'],
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    if (response.status === 200) {
      const completionData = response.data;
      let suggestedPrompts: SuggestedPrompts | undefined = undefined;
      if (completionData.choices[0].finish_reason === 'tool_calls') {
        // @ts-expect-error tool_calls should exist if it is a tool call
        console.log(completionData.choices[0].message.tool_calls[0].function.arguments);
        // @ts-expect-error tool_calls should exist if it is a tool call
        suggestedPrompts = JSON.parse(completionData.choices[0].message.tool_calls[0].function.arguments) as SuggestedPrompts | undefined;
        console.log(suggestedPrompts);
      }
      let suggestedPromptsContent, prompts;
      if (suggestedPrompts) {
        suggestedPromptsContent = suggestedPrompts.content;
        prompts = { prompt_1: suggestedPrompts.prompt_1, prompt_2: suggestedPrompts.prompt_2, prompt_3: suggestedPrompts.prompt_3, prompt_4: suggestedPrompts.prompt_4 };
      }
      const { data, error } = await supabase
        .from('higgins_chat_completion')
        .insert({
          id: completionData.id,
          object: completionData.object,
          created: completionData.created,
          model: completionData.model,
          role: completionData.choices[0].message.role,
          message: completionData.choices[0].message.content || suggestedPromptsContent || '',
          finish_reason: completionData.choices[0].finish_reason,
          prompt_tokens: completionData.usage.prompt_tokens,
          completion_tokens: completionData.usage.completion_tokens,
          total_tokens: completionData.usage.total_tokens,
          user_id: userId,
          chat_id: chatId,
          prompt: userInput,
          documents: supportingDocs as string[] | null | undefined,
          suggested_prompts: prompts,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
        res.status(500);
        res.send({ ok: false, data: [], message: error.message });
        return;
      }
      // console.log(data);
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
    console.log(`USER_ID: ${req?.query?.user_id} – GET HIGGINS COMPLETION`);
    const userId = req?.query?.user_id as string | undefined;
    const chatId = req?.params?.id as string | undefined;
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
    const token = jwt.sign({ sub: userId, role: 'authenticated' }, process.env.SUPABASE_JWT_SECRET!);
    const supabase = createClient({ req, res }, token);
    const { data, error } = await supabase.from('higgins_chat_completion').select().eq('user_id', userId).eq('chat_id', chatId).eq('id', completionId).single();
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
