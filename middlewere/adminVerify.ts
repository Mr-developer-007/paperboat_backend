import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import Admin from "../model/adminModel";

export interface AdminAuth extends Request{
    admin :any
}



export const AdminVerify = async(req:AdminAuth,res:Response,next:NextFunction)=>{
    try {
        const token= req.cookies.admin
        if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
 if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

 
    req.admin = admin;

next()
} catch (error) {
        next(error)
    }
}