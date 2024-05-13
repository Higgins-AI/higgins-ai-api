import { createServerClient } from '@supabase/ssr';
import { Database } from '../../types/supabase.types';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

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

export const getRelatedDocs = async (
  inputString: string,
  organization: string
) => {
  const chromaClient = new ChromaClient({
    path: process.env.CHROMADB_PRO_URL,
  });
  const openAIEmbedder = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY!,
  });
  const collection = await chromaClient.getCollection({
    name: organization,
    embeddingFunction: openAIEmbedder,
  });
  const documents = await collection.query({
    queryTexts: inputString,
    nResults: 5,
  });
  if (!documents.documents) {
    return undefined;
  }
  return documents.documents;
};
