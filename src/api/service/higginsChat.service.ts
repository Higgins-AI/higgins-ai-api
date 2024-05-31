import jwt from "jsonwebtoken";
import createClient from "../lib/supabase";
import {ReqResCtx} from "../../types/types";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchHigginsChatForUserIdAndOrganization = (ctx: ReqResCtx, userId: string, organization: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .select()
    .eq("user_id", userId)
    .eq("organization", organization)
    .order("created_at", { ascending: true });
}

export const fetchHigginsChatForUserIdAndOrganizationLikeTitle = (ctx: ReqResCtx, userId: string, organization: string, title: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .select()
    .eq("user_id", userId)
    .eq("organization", organization)
    .like("title", `%${title}%`);
}

export const upsertHigginsChat = (ctx: ReqResCtx, userId: string, chatId: string, createdAt: string, organization: string, title: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .upsert({
      id: chatId,
      created_at: createdAt,
      user_id: userId,
      organization,
      title,
    })
    .select()
    .single();
}

export const fetchHigginsChatForIdAndUserId = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .select()
    .eq("user_id", userId)
    .eq("id", chatId)
    .single();
}

export const updateHigginsChat = (ctx: ReqResCtx, userId: string, title: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .update({title})
    .eq("id", chatId)
    .select()
    .single();
}

export const deleteHigginsChat = (ctx: ReqResCtx, userId: string, chatId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from("higgins_chat")
    .delete()
    .eq("id", chatId)
    .eq("user_id", userId)
    .single();
}