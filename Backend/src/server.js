import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import connectDB from "./database/mongodb.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
