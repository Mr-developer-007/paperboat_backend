import type { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Paper from "../../model/paperModel";
import { removeImage } from "../../helper/removeImage";
import sharp from "sharp";
import crypto from "crypto"
import { DeleteR2Image, UploadR2Image } from "../../helper/UploadImage";

export const createPaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, agency, year, state, description } = req.body;
    const files: any = req.files;

    let thumbnail = ""; 
    let images: string[] = [];

    // thumbnail
    if (files?.thumbnail && files.thumbnail.length > 0) {
 const webpBuffer = await sharp(files.thumbnail[0].buffer)
         .webp({
           quality: 80,
         })
         .toBuffer();
const filename = `paper/${crypto.randomUUID()}.webp`;
await UploadR2Image(filename,webpBuffer)
      thumbnail =  `${process.env.R2_PUBLIC_URL}/${filename}`;
    }

   if (files?.images && files.images.length > 0) {
  images = await Promise.all(
    files.images.map(async (file: any) => {
      const webpBuffer = await sharp(file.buffer)
        .webp({
          quality: 80,
        })
        .toBuffer();

      const filename = `paper/${crypto.randomUUID()}.webp`;

      await UploadR2Image(filename, webpBuffer);

      return `${process.env.R2_PUBLIC_URL}/${filename}`;
    })
  );
}


    const slug = slugify(name, { lower: true });


    const paper = await Paper.create({
      name,
      slug,
      agency,
      year,
      state,
      thumbnail,
      images,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Paper created successfully",
      paper,
    });


  } catch (error) {


    next(error)
  }
}

export const getPaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;

    const skip = (page - 1) * limit;

    const data = await Paper.find()
      .skip(skip)
      .limit(limit).select("name thumbnail view description state year slug").populate("state year");


    const totalPaper = await Paper.countDocuments();


    return res.status(200).json({
      success: true,
      page,
      totalPaper,
      totalPages: Math.ceil(totalPaper / limit),
      data
    });

  } catch (error) {
    next(error)
  }
}

export const getSinglePaper = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { slug } = req.params;

    const paper = await Paper.findOne({ slug }).lean();

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: paper,
    });

  } catch (error) {
    next(error)
  }
}




export const editPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    let {
      name,
      agency,
      year,
      state,
      description,
      deleteimage,
    } = req.body;

    const files: any = req.files;

    // =========================
    // Find Paper
    // =========================

    const paper = await Paper.findOne({ slug });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    // =========================
    // Normalize deleteimage
    // =========================

    if (deleteimage && !Array.isArray(deleteimage)) {
      deleteimage = [deleteimage];
    }

    // =========================
    // Update Basic Fields
    // =========================

    if (name) paper.name = name.trim();

    if (agency) paper.agency = agency.trim();

    if (year) paper.year = year;

    if (state) paper.state = state;

    if (description) {
      paper.description = description.trim();
    }

    // =========================
    // Upload New Thumbnail
    // =========================

    let newthumbnail = "";

    if (files?.newthumbnail?.length > 0) {
      const webpBuffer = await sharp(
        files.newthumbnail[0].buffer
      )
        .webp({
          quality: 80,
        })
        .toBuffer();

      const filename = `paper/${crypto.randomUUID()}.webp`;

      await UploadR2Image(filename, webpBuffer);

      newthumbnail = `${process.env.R2_PUBLIC_URL}/${filename}`;
    }

    // ========================= 
    // Delete Selected Images
    // =========================

    if (deleteimage?.length > 0) {
      for (const img of deleteimage) {
        try {
          await DeleteR2Image(img);
        } catch (error) {
          console.log("Delete Image Error:", error);
        }
      }

      paper.images = paper.images.filter(
        (img) => !deleteimage.includes(img)
      );
    }

    // =========================
    // Replace Thumbnail
    // =========================

    if (newthumbnail) {
      try {
        await DeleteR2Image(paper.thumbnail as string);
      } catch (error) {
        console.log("Old Thumbnail Delete Error:", error);
      }

      paper.thumbnail = newthumbnail;
    }

    // =========================
    // Upload New Images
    // =========================

    let images: string[] = [];

    if (files?.newimage?.length > 0) {
      images = await Promise.all(
        files.newimage.map(async (file: any) => {
          const webpBuffer = await sharp(file.buffer)
            .webp({
              quality: 80,
            })
            .toBuffer();

          const filename = `paper/${crypto.randomUUID()}.webp`;

          await UploadR2Image(filename, webpBuffer);

          return `${process.env.R2_PUBLIC_URL}/${filename}`;
        })
      );
    }

    // append new images
    if (images.length > 0) {
      paper.images.push(...images);
    }

   

    await paper.save();

    return res.status(200).json({
      success: true,
      message: "Paper updated successfully",
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};





export const saveDrage= async( req: Request,
  res: Response,
  next: NextFunction)=>{
  try {
    const { slug } = req.params;
   const {images} = req.body;

 const paper = await Paper.findOne({ slug });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

paper.images = images

await paper.save()


 return res.status(200).json({
      success: true,
      message: "Paper updated successfully",
      data: paper,
    });

  } catch (error) {
      next(error);
  }
}

















export const getView = async (req: Request, res: Response, next: NextFunction)=>{
   try {

    const { slug } = req.params;

    const paper = await Paper.findOne({ slug }).lean().populate("agency year state");

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: paper,
    });

  } catch (error) {
    next(error)
  }
}

export const deletePaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paperid = req.params.id;

    const paper = await Paper.findById(paperid);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found"
      });
    }

    if (paper.images && paper.images.length > 0) {
      await Promise.all(
        paper.images.map((img: string) => DeleteR2Image(img))
      );
    }

    if (paper.thumbnail) {
      await DeleteR2Image(paper.thumbnail);
    }

    await paper.deleteOne();

    res.status(200).json({
      success: true,
      message: "Paper deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};