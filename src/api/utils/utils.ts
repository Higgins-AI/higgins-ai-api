import { createServerClient } from '@supabase/ssr';
import { Database } from '../../types/supabase.types';
import { Request, Response } from 'express';

export const createClient = (
  context: { req: Request; res: Response },
  token?: string
) => {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
      cookies: {
        get: (key) => {
          if (!key) return;
          const cookies = context.req.cookies;
          const cookie = cookies[key] ?? '';
          if (!cookie) return;
          return decodeURIComponent(cookie);
        },
        set: (key, value, options) => {
          if (!context.res) return;
          context.res.cookie(key, encodeURIComponent(value), {
            ...options,
            sameSite: 'Lax',
            httpOnly: true,
          });
        },
        remove: (key, options) => {
          if (!context.res) return;
          context.res.cookie(key, '', { ...options, httpOnly: true });
        },
      },
    }
  );
};
