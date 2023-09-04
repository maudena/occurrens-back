import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import router from "./routes/routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import multer from "multer";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use("/public", express.static(path.join(__dirname, 'public')))
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public"),
  filename:(req, file, cb,) => {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})
app.use(multer({storage: storage}).single("image"))


app.use(
  cors({
    credentials: true,
    origin: ["https://occurrens.netlify.app"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);


const PORT = process.env.PORT ?? 3000


try {
  mongoose
    .connect(process.env.MONGOURI)
    .then(console.log("DB ON"));
  app.listen(PORT, () => console.log("Server Up"));
} catch (error) {
  console.log(error);
}
