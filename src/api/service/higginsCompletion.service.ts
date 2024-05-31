import {OpenAiCompletion, ReqResCtx} from "../../types/types";
import jwt from "jsonwebtoken";
import createClient from "../lib/supabase";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchHigginsChatCompletion = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('higgins_chat_completion')
    .select()
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .order('created', { ascending: true });
}

export const insertHigginsChatCompletion = (ctx: ReqResCtx, userId: string, chatId: string, userInput: string, completionData: OpenAiCompletion, supportingDocs?: (string | undefined)[]) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('higgins_chat_completion')
    .insert({
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
      documents: supportingDocs,
    })
    .select()
    .single();
}

export const fetchHigginsChatCompletionForIdAndUserIdAndChatId = (ctx: ReqResCtx, userId: string, chatId: string, completionId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('higgins_chat_completion')
    .select()
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .eq('id', completionId)
    .single();
}