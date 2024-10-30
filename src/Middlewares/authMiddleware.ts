import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  { JwtPayload } from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
  userId?: string; 
}
const authentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: "Access denied, Login Again" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    req.userId = (data as JwtPayload).userId;
    next();
  } catch (error) {
    res.json({ error: error});
    return res.status(401).json({ error: "Invalid token , Login Again" });
  }
};

export default authentication;

