import { Router } from "express";
import { login, register } from "../Controllers/authController.js";
const authRouter = Router();
 authRouter.post("/register",register as any);
 authRouter.post("/login", login as any);

export default authRouter;
