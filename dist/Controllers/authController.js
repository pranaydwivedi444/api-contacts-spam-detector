var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/db.js";
import checkValidation from "../lib/zodValidation.js";
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = checkValidation(req.body);
    if (!result.isValid) {
        return res.status(400).json(result.errors);
    }
    const { name, phoneNumber, password, email } = req.body;
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        const user = yield prisma.user.create({
            data: {
                name,
                phoneNumber,
                password: hashedPassword,
                email: email || null,
            },
        });
        console.log(user);
        res.json({ message: "User registered successfully , Now Login Again" });
    }
    catch (error) {
        res.status(400).json({ error: "Phone number already registered" });
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = req.body;
    const user = yield prisma.user.findFirst({ where: { phoneNumber } });
    if (!user) {
        return res.status(401).json({ error: "Invalid phone or password" });
        //not mentioning the problem because of security issues
    }
    const passwordMatch = yield bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid phone or password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret_key", { expiresIn: "7d" });
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'lax' : 'none',
        maxAge: 60 * 60 * 1000,
    });
    res.json({ message: "Login successful" });
});
