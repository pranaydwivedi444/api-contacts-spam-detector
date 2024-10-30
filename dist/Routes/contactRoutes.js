import { Router } from "express";
import { markAsSpam, searchContacts } from "../Controllers/contactsController.js";
import authentication from "../Middlewares/authMiddleware.js";
const contactRouter = Router();
//checked if user is logged in
contactRouter.use(authentication);
contactRouter.post("/spam", markAsSpam);
contactRouter.get("/search", searchContacts);
export default contactRouter;
