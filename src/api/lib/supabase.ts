import {createServerClient} from '@supabase/ssr'
import dotenv from "dotenv";
import {ReqResCtx} from "../../types/types";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? ''

const createClient = (context: ReqResCtx, token: string) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    cookies: {
      get: (key) => {
        const cookies = context.req.cookies
        const cookie = cookies[key] ?? ''
        return decodeURIComponent(cookie)
      },
      set: (key, value, options) => {
        if (!context.res) return
        context.res.cookie(key, encodeURIComponent(value), {
          ...options,
          sameSite: 'Lax',
          httpOnly: true,
        })
      },
      remove: (key, options) => {
        if (!context.res) return
        context.res.cookie(key, '', {...options, httpOnly: true})
      },
    },
  })
}

export default createClient