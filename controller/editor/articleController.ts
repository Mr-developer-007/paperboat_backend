import  type { NextFunction, Request, Response } from "express";
import Article from "../../model/articleModel";
import { UploadR2Image } from "../../helper/UploadImage";
import sharp from "sharp";


interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
  editor :any
}
export interface SectionInput {
  title: string;
  description: string;
  image?: string | null;
  countImg:string
}

export const createArticle= async(req:MulterRequest,res:Response,next:NextFunction)=>{
try {
const {_id} = req.editor
const {
      title,
      description,
      category,
      readingTime,
      status,
      tags,
      sections,
    } = req.body; 


     const parsedTags: string[] = JSON.parse(tags || "[]");
    const parsedSections: SectionInput[] = JSON.parse(sections || "[]");
 const files: any = req.files;
      let featuredImage = "";
      if (files?.featuredImage?.length > 0) {
            const webpBuffer = await sharp(
              files.featuredImage[0].buffer
            )
              .webp({
                quality: 80,
              })
              .toBuffer();
      
            const filename = `article/${crypto.randomUUID()}.webp`;
      
            await UploadR2Image(filename, webpBuffer);
      
            featuredImage = `${process.env.R2_PUBLIC_URL}/${filename}`;
          }





let sectionImages: string[] = [];

   if (files?.sectionImages && files.sectionImages.length > 0) {
  sectionImages = await Promise.all(
    files.sectionImages.map(async (file: any) => {
      const webpBuffer = await sharp(file.buffer)
        .webp({
          quality: 80,
        })
        .toBuffer();

      const filename = `section/${crypto.randomUUID()}.webp`;

      await UploadR2Image(filename, webpBuffer);

      return `${process.env.R2_PUBLIC_URL}/${filename}`;
    })
  );
}




const sectionsWithImages: SectionInput[] = parsedSections.map(
      (section, index) => ({
        ...section,
        image: sectionImages[parseInt(section.countImg)] || null,
      })
    );




const slug = `${title.split(" ").join("-")}-${Date.now()}`


const article = {
      title,
      description,
      category,
      readingTime: Number(readingTime),
      status,
      tags: parsedTags,
      featuredImage,
      slug,
      editor:_id,
      fulldis: sectionsWithImages,
    };


  // const articleSave = await Article.create(article);

 res.status(201).json({
  success:true,
      message: "Article created successfully",
      // data: articleSave,
    });

    
} catch (error) {
  console.log(error,"Dsd")
    next(error)
}
}