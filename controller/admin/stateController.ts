import type { NextFunction, Request, Response } from "express";
import State from "../../model/stateModel";
import { removeImage } from "../../helper/removeImage";
import sharp from "sharp";
import crypto from "crypto"
import { DeleteR2Image, UploadR2Image } from "../../helper/UploadImage";

export  const createState=async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {state} =req.body;
 
           if (!state) {
      return res.status(400).json({
        success: false,
        message: "State name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }








     const allreadyState= await State.findOne({state:state.toLowerCase()});
     if(allreadyState){
        const error = new Error("State Allreadt Exist")  as any
        error.status= 400
        throw error;  
     }

    //  const newState = await State.create({
    //     state:state.toLowerCase(),image
    //  })
  const webpBuffer = await sharp(req.file.buffer)
      .webp({
        quality: 80,
      })
      .toBuffer();
 const filename = `states/${crypto.randomUUID()}.webp`;
  await UploadR2Image(filename,webpBuffer)
const imageUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;
  const newState = await State.create({
      state: state.trim(),
      image: imageUrl, 
    }); 

        return res.status(201).json({success:true,message:"State Added",newState})
        
    } catch (error) {
        // removeImage(req.file?.path as string)
        next(error)
    }
}

export const getState= async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const states = await State.find();
        return res.status(200).json({states})
        
    } catch (error) {
        next(error)
    }
}

export const deletState= async(req:Request,res:Response,next:NextFunction)=>{
try {
    const id = req.params.id;

  const state = await State.findById(id);
  if(!state){
    const error = new Error("State not found") as any;
    error.status =400;
    throw error
  }

 await DeleteR2Image(state.image)
//   await removeImage(state.image as string)
  await state.deleteOne();
  return res.status(200).json({success:true,message:"State removed"})
} catch (error) {
    next(error)
}
}