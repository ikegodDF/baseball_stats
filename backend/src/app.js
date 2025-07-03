import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import gameResultsRouter from "../routes/getGameResults.js";
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../frontend")));
app.use("/api", gameResultsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
