import {ReqResCtx} from "../../types/types";
import jwt from "jsonwebtoken";
import createClient from "../lib/supabase";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchCompletionFeedback = (ctx: ReqResCtx, userId: string, completionId: string, chatId: string) => {
  const token = jwt.sign(
    { sub: userId, role: "authenticated" },
    jwtSecret
  );
  const supabase = createClient(ctx, token);
  return supabase
    .from("completion_feedback")
    .select()
    .eq("user_id", userId)
    .eq("completion_id", completionId)
    .eq("chat_id", chatId);
}

export const upsertFeedback = (ctx: ReqResCtx, userId: string, ratingId: string, chatId: string, completionId: string, rating: string, prompt: string, completion: string) => {
  const token = jwt.sign(
    { sub: userId, role: "authenticated" },
    jwtSecret
  );
  const supabase = createClient(ctx, token);
  return supabase
    .from("completion_feedback")
    .upsert([
      {
        user_id: userId,
        id: ratingId,
        chat_id: chatId,
        completion_id: completionId,
        created_at: new Date().toISOString(),
        rating,
        prompt,
        completion,
      },
    ])
    .select()
    .single();
}

export const deleteFeedback = (ctx: ReqResCtx, userId: string, completionId: string, chatId: string) => {
  const token = jwt.sign(
    { sub: userId, role: "authenticated" },
    jwtSecret
  );
  const supabase = createClient(ctx, token);
  return supabase
    .from("completion_feedback")
    .delete()
    .eq("user_id", userId)
    .eq("completion_id", completionId)
    .eq("chat_id", chatId)
    .single();
}