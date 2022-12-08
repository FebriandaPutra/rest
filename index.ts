import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import multerUpload from "./middleware/file";

const path = require("path");
const router = require("./router/router");
const cors = require("cors");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.static("static"));
app.use(multerUpload);
app.use(bodyParser.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
