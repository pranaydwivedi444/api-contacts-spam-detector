import express from 'express';
import authRouter from './Routes/authRoutes.js';
import contactRouter from './Routes/contactRoutes.js';
import cookieParser from 'cookie-parser';
const app = express();
const port = process.env.PORT || 3000;
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
