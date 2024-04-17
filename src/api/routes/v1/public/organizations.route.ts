import express from "express";
import dotenv from "dotenv";
import { createClient } from "../../../utils/utils";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET PUBLIC ORGANIZATIONS`);

    const userId = req?.query?.user_id as string | undefined;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);

    const { data: organizations, error: organizationsError } = await supabase
      .from("higgins_ai_public_organization")
      .select();

    if (organizationsError) {
      res.status(500);
      res.send({ ok: false, data: [], message: organizationsError.message });
      return;
    }

    if (organizations) {
      res.status(200);
      res.send({ ok: true, data: organizations, message: "success" });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: [], message: "success" });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    console.log(`USER_ID: ${req?.query?.user_id} – GET PUBLIC ORGANIZATION`);

    const userId = req?.query?.user_id as string | undefined;
    const organizationId = req?.params?.id;

    if (!userId) {
      res.status(400);
      res.send({ ok: false, data: [], message: "Authentication Error" });
      return;
    }
    const token = jwt.sign(
      { sub: userId, role: "authenticated" },
      process.env.SUPABASE_JWT_SECRET!
    );
    const supabase = createClient({ req, res }, token);
    const { data: organization, error: organizationError } = await supabase
      .from("higgins_ai_public_organization")
      .select()
      .eq("user_id", userId)
      .eq("id", organizationId)
      .single();
    if (organizationError) {
      res.status(500);
      res.send({ ok: false, data: [], message: organizationError.message });
      return;
    }
    res.status(200);
    res.send({ ok: true, data: organization, message: "success" });
  } catch (error: any) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, data: [], message: "Something went wrong" });
    return;
  }
});

export default router;
