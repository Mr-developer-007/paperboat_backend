import type { NextFunction, Request, Response } from "express";
import { removeImage } from "../../helper/removeImage";
import Exam from "../../model/examModels";
import slugify from "slugify";
import sharp from "sharp";
import { DeleteR2Image, UploadR2Image } from "../../helper/UploadImage";
import crypto from "crypto"

export const createExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, state } = req.body;

     if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
 
    if (!name) {
      throw new Error("Exam name is required");
    }

    const slug = slugify(name, { lower: true });
    

     const webpBuffer = await sharp(req.file.buffer) 
         .webp({
           quality: 80,
         })
         .toBuffer();

          const filename = `exam/${crypto.randomUUID()}.webp`;
           await UploadR2Image(filename,webpBuffer)
         const imageUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;


    const exam = await Exam.create({
      name,
      slug,
      logo: imageUrl,
      state
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam
    });

  } catch (error) {

    // if (req?.file?.path) {
    //   removeImage(req.file.path as string);
    // }

    next(error);
  }
};

export const getExam= async(req: Request,res: Response,next: NextFunction)=>{
try {
    const allExam = await Exam.find()
    return res.status(200).json({success:true,exam:allExam})
    
} catch (error) {
   next(error) 
}
}

export const deleteExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found"
      });
    }

    // remove logo
    if (exam.logo) {
      await DeleteR2Image(exam.logo  as string)
    }

    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};