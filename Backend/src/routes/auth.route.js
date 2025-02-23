import { Router } from "express";
import { Login, Logout, SignUp, UpdateProfile, CheckAuth } from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", Login);

authRouter.post("/signup", SignUp);

authRouter.post("/logout", Logout);

authRouter.post("/update-profile", protectedRoute , UpdateProfile);

authRouter.get("/check-auth", protectedRoute, CheckAuth);

export default authRouter;
