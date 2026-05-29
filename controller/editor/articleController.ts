import  type { NextFunction, Request, Response } from "express";
import Article from "../../model/articleModel";
import { DeleteR2Image, UploadR2Image } from "../../helper/UploadImage";
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
image?: string;
  countImg:string
}

export const createArticle= async(req:MulterRequest,res:Response,next:NextFunction)=>{
try {
const {_id} = req.editor
const {
      title ,
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
  (section) => ({
    ...section,
    image:
      sectionImages[parseInt(section.countImg)] || undefined,
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


  await Article.create(article);

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

interface AutRequest extends Request {
 
  editor :any
}

export const getMyArticle = async (
  req: AutRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const editor = req.editor;

    const articles = await Article.find({
      editor: editor._id,
    }).select(
      "title slug featuredImage status views category"
    );

    res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
};


 export const getSingleArticle = async( req: AutRequest,res: Response,next: NextFunction)=>{
try {
  const {slug}= req.params;
const editor = req.editor;
const article = await Article.findOne({
  slug,editor:editor._id
})

if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      article,
    });


} catch (error) {
  next(error)
}
}




export const  UpdateArticle = async(req: MulterRequest,res: Response,next: NextFunction)=>{
try {
    const {id}= req.params;
const editor = req.editor;
const article = await Article.findOne({
  _id:id,editor:editor._id
})

if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }




    const {title,description,category,readingTime,tags,status} = req.body


    
    article.title = title
    article.description = description
    article.category = category
    article.readingTime = Number(readingTime)

    article.tags = JSON.parse(tags)
    article.status=status
const files: any = req.files;
   
     
      if (files?.newfeaturedImage?.length > 0) {
            const webpBuffer = await sharp(
              files.newfeaturedImage[0].buffer
            )
              .webp({
                quality: 80,
              })
              .toBuffer();
      
            const filename = `article/${crypto.randomUUID()}.webp`;
      
            await UploadR2Image(filename, webpBuffer);
      await DeleteR2Image(article.featuredImage)
            article.featuredImage = `${process.env.R2_PUBLIC_URL}/${filename}`;
          }




     
await article.save()







 res.status(201).json({
  success:true,
      message: "Article created successfully",
      
    });


 
    









} catch (error) {
  next(error)
}


}



 