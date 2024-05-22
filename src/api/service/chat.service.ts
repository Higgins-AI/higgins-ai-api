import createClient from "../lib/supabase";
import {OpenAiCompletion, ReqResCtx} from "../../types/types";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchChatForUserId = (ctx: ReqResCtx, userId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .select()
    .eq('user_id', userId);
}

export const fetchChatForUserIdAndIndustry = (ctx: ReqResCtx, userId: string, industry: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .select()
    .eq('user_id', userId)
    .eq('industry', industry);
}

export const fetchChatForUserIdAndIndustryLikeTitle = (ctx: ReqResCtx, userId: string, industry: string, title: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .select()
    .eq('user_id', userId)
    .eq('industry', industry)
    .like('title', `%${title}%`);
}

export const upsertChat = (ctx: ReqResCtx, userId: string, chatId: string, createdAt: string, title: string, industry: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .upsert({
      id: chatId,
      created_at: createdAt,
      user_id: userId,
      title,
      industry,
    })
    .select()
    .single();
}

export const fetchChatforIdAndUserId = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .select()
    .eq('user_id', userId)
    .eq('id', chatId)
    .single();
}

export const updateChatTitle = (ctx: ReqResCtx, userId: string, chatId: string, title: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .update({title})
    .eq('id', chatId)
    .select()
    .single();
}

export const deleteChatForId = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('chat')
    .delete()
    .eq('id', chatId)
    .eq('user_id', userId)
    .single();
}
