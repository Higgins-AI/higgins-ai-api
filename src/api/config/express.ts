import express from "express";
import cors from "cors";
import { json as _json } from "express";
import router from "../routes/v1";

/**
 * Express instance
 * @public
 */
const app = express();

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.use(_json());

// mount api v1 routes
app.use("/v1", router);

export default app;
