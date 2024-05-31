import express from "express";
import cors from "cors";
import {json as _json} from "express";
import router from "../routes/v1";
import cookies from "cookie-parser";

/**
 * Express instance
 * @public
 */
const app = express();

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.use(_json());
app.use(cookies());

// mount api v1 routes
app.use("/api/v1", router);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);

  if (err.message.includes('Unauthenticated')) {
    res.status(401).json({ok: false, data: [], message: err.message});
  } else {
    next(err)
  }
});


export default app;
