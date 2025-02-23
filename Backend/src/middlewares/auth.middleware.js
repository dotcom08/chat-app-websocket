import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

export default async function protectedRoute(req, res, next) {

    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token" });
            
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userID).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized - User not found" });
        }
        
        req.user = user;
        next();
        
    } catch (error) {
        console.log("Error in protected route", error.message);
        res.status(400).json({ success: false, message: error.message });
        
    }

}