import express, { json as _json } from "express";
import cors from "cors";
import app from "./api/config/express";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("Listening on port " + PORT));
app.use(cors());
app.use(_json());
