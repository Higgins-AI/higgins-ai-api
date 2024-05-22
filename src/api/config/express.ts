import express, {ErrorRequestHandler, NextFunction} from "express";
import cors from "cors";
import {json as _json} from "express";
import router from "../routes/v1";
import cookies from "cookie-parser";
import {ClerkExpressWithAuth, clerkClient, ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

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

app.get('/protected-endpoint', ClerkExpressRequireAuth(), (req, res) => {

  // @ts-ignore
  console.log(req.auth.sessionClaims.orgs)

  // @ts-ignore
  clerkClient.organizations.getOrganization({organizationId: Object.keys(req.auth.sessionClaims.orgs)[0]})
    .then(org => {
      console.log(org)
    })
  // @ts-ignore
  res.json(req.auth)
})


export default app;
