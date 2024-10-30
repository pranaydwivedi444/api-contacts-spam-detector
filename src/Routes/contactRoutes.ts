import { Router } from "express";
import { markAsSpam, searchContacts } from "../Controllers/contactsController.js";
import authentication from "../Middlewares/authMiddleware.js";
const contactRouter = Router();
//checked if user is logged in
contactRouter.use(authentication as any);
contactRouter.post("/spam", markAsSpam as any); 
contactRouter.get("/search", searchContacts as any);

export default contactRouter;