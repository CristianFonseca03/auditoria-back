import express, { Application } from "express";
import cors from "cors";

import "dotenv/config";

import "./database/connectDatabase";
import { user, auth, entry, admin } from "./routes";

const app: Application = express();

app.set("port", process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", user);
app.use("/api/admin", admin);
app.use("/api/auth", auth);
app.use("/api/entry", entry);

/* app.get('/ping', (_req, res) => {
    console.log('funcionaaaa');
    res.send('pong');

}); */

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});
