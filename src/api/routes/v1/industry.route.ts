import express from 'express';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';
import { createClient } from '../../utils/utils';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET INDUSTRIES`);
    const userId = req?.query?.user_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: 'authenticated' },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data: industries, error: industriesError } = await supabase
      .from('industry')
      .select()
      .order('created_at', { ascending: true });
    if (industriesError) {
      res.status(500);
      res.send({ ok: false, data: [], message: industriesError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: industries, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

export default router;
