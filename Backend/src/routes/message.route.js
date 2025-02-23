

import { Router } from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get("/users",protectedRoute,  getUsersForSidebar);
messageRouter.get("/:id", protectedRoute, getMessages);
messageRouter.post("/send/:id", protectedRoute, sendMessage);

export default messageRouter;