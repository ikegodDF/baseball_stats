import express from "express";
import { fileURLToPath } from "url";
import path from "path";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../frontend")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
