import createClient from "../lib/supabase";
import {OpenAiCompletion, ReqResCtx} from "../../types/types";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchChat = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase.from('chat')
    .select()
    .eq('id', chatId)
    .single();
}

export const fetchChatByUserIdAndChatId = (ctx:ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat_completion')
    .select()
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .order('created', { ascending: true });
}

export const fetchChatByUserIdAndChatIdAndCompletionId = (ctx:ReqResCtx, userId: string, chatId: string, completionId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat_completion')
    .select()
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .eq('id', completionId)
    .single();
}

export const fetchIndustryForName = (ctx: ReqResCtx, userId: string, industryName: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase.from('industry')
    .select()
    .eq('name', industryName)
    .single();
}

export const upsertChatCompletion = (ctx:ReqResCtx, userId: string, chatId: string, completion: OpenAiCompletion, userInput: string, supportingDocs?: (string | undefined)[]) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat_completion')
    .upsert({
      id: completion.id,
      object: completion.object,
      created: completion.created,
      model: completion.model,
      role: completion.choices[0].message.role,
      message: completion.choices[0].message.content,
      finish_reason: completion.choices[0].finish_reason,
      prompt_tokens: completion.usage.prompt_tokens,
      completion_tokens: completion.usage.completion_tokens,
      total_tokens: completion.usage.total_tokens,
      user_id: userId,
      chat_id: chatId,
      prompt: userInput,
      documents: supportingDocs,
    })
    .select()
    .single();
}