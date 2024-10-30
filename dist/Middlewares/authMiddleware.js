import jwt from "jsonwebtoken";
const authentication = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ error: "Access denied, Login Again" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        req.userId = data.userId;
        next();
    }
    catch (error) {
        res.json({ error: error });
        return res.status(401).json({ error: "Invalid token , Login Again" });
    }
};
export default authentication;
