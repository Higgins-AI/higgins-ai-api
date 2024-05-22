import express from 'express';
import dotenv from 'dotenv';
import {fetchAllIndustries} from "../../service/industry.service";

dotenv.config();

const router = express.Router();

router.route('/').get(async (req: express.Request<any, any, any, { user_id: string }>, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET INDUSTRIES`);
    const userId = req.query.user_id;

    if (!userId) {
      res.status(400).json({ ok: false, data: [], message: 'Authentication Error' });
      return;
    }
    const { data: industries, error: industriesError } = await fetchAllIndustries({ req, res }, userId)
    if (industriesError) {
      res.status(500).json({ ok: false, data: [], message: industriesError.message });
      return;
    }
    console.log(industries);
    res.status(200);
    res.send({ ok: true, data: industries, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ ok: false, data: [], message: 'Something went wrong' });
    return;
  }
});

export default router;
