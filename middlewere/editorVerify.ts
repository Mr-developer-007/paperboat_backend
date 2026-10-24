import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"

import Editor from "../model/editorModel";

export interface EditorAuth extends Request{
    editor :any
}



export const verifyEditor = async(req:EditorAuth,res:Response,next:NextFunction)=>{
    try {
        const token= req.cookies.editor
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
const editor = await Editor.findById(decoded.id).select("-password");

    if (!editor) {
      return res.status(404).json({
        success: false,
        message: "Editor not found",
      });
    }

 
    req.editor = editor;

next()
} catch (error) {
        next(error)
    }
}