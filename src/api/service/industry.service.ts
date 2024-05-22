import jwt from "jsonwebtoken";
import createClient from "../lib/supabase";
import {ReqResCtx} from "../../types/types";

const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? ''

export const fetchAllIndustries = (ctx: ReqResCtx, userId: string) => {
  const token = jwt.sign(
    {sub: userId, role: 'authenticated'},
    jwtSecret
  );
  const supabase = createClient(ctx, token)
  return supabase
    .from('industry')
    .select('*')
    .order('created_at', { ascending: true });
}