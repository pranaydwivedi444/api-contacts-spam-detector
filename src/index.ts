import express from 'express';
import authRouter from './Routes/authRoutes.js';
import contactRouter from './Routes/contactRoutes.js';
import cookieParser from 'cookie-parser';
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import hpp from 'hpp';
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

const app = express();
const port = process.env.PORT || 3000;
//rate limites security
app.use(limiter);
//cross xss attacks 
app.use(helmet());

//prevent paramter pullution
app.use(hpp())
//body parser
app.use(express.json())
app.use(cookieParser());


app.get("/", (req: express.Request, res : express.Response) => {
    res.send("Welcome to InstaHyre API ");
});

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
