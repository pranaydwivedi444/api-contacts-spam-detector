import { Router } from "express";
import { login, logout, register } from "../Controllers/authController.js";
const authRouter = Router();
 authRouter.post("/register",register as any);
 authRouter.post("/login", login as any);
 authRouter.post("/logout", logout as any);
export default authRouter;
