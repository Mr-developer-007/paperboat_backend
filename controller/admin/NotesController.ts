import type { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { DeleteR2Image, UploadR2Image, UploadR2PDF } from "../../helper/UploadImage";
import NoteUser from "../../model/notesUser";
import Notes from "../../model/notesSchema";





export const createNotesUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, contactlinks } = req.body;

    let img = "";

    if (req.file) {
      const webpBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const filename = `notes-user/${crypto.randomUUID()}.webp`;

      await UploadR2Image(filename, webpBuffer);

      img = `${process.env.R2_PUBLIC_URL}/${filename}`;
    }

    const notesUser = await NoteUser.create({
      name,
      about,
      image: img,
      contactlinks: contactlinks
        ? JSON.parse(contactlinks)
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Notes user created successfully",
      notesUser,
    });
  } catch (error) {
    next(error);
  }
};


export const getNotesUser = async( req: Request,res: Response,next: NextFunction)=>{
  try {
    const users = await NoteUser.find();
 return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error)
  }

}

export const getNoteUser= async( req: Request,res: Response,next: NextFunction)=>{
  try {
const userId = req.params.id;

  const user = await NoteUser.findById(userId);
  
  
return res.status(200).json({success:true,user})
  } catch (error) {
    next(error)
  }
}

export const DeleteUser = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    
    const userId = req.params.id;
     if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

  const user = await NoteUser.findById(userId);

  if(!user){
    return res.status(404).json({
        success: false,
        message: "User not found",
      }); 
  }
 if (user.notes && user.notes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user because this user has notes",
      });
    }

 if (user.image) {
      try {
        await DeleteR2Image(user.image);
      } catch (error) {
        console.error("R2 image deletion failed:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to delete user image",
        });
      }
    }

await user.deleteOne()
return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    next(error)
  }
}




export const CreateNotes =async( req: Request,res: Response,next: NextFunction)=>{
 const files: any = req.files;

   try {
        let thumbnail = ""; 
       let pdflink= ""
    const {title,user} = req.body
if(!title || !user){
  return res.status(200).json({success:false,message:"title and user Required"})
}


    const notesUser = await NoteUser.findById(user);
    if(!notesUser){
      return res.status(404).json({success:false,message:"user not found"})
    }
    if(!files.thumbnail.length || !files.pdffile.length ){
return res.status(404).json({success:false,message:"thumbnail and PDF require"})
    }


           if(files.thumbnail || files.thumbnail.length > 0){
const webpBuffer = await sharp(files.thumbnail[0].buffer)
         .webp({
           quality: 80,
         })
         .toBuffer();

const filename = `notes-thumb/${crypto.randomUUID()}.webp`;

await UploadR2Image(filename,webpBuffer)
      thumbnail =  `${process.env.R2_PUBLIC_URL}/${filename}`;
           }

               if(files.pdffile || files.pdffile.length > 0){

      const pdfFile = files.pdffile[0];
 if (pdfFile.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
        const filename = `notes-pdf/${crypto.randomUUID()}.pdf`;

      await UploadR2PDF(
        filename,
        pdfFile.buffer
      );

      pdflink = `${process.env.R2_PUBLIC_URL}/${filename}`;


           }

const note = await Notes.create({title,user,pdflink,thumbnail})

note.populate("user","name,image")

     
return res.status(201).json({success:true,message:"Notes Added",note})

  } catch (error) {
    next(error)
  }
}


export const getNotes = async ( req: Request,res: Response,next: NextFunction)=>{

try {
const notes =  await Notes.find().populate("user","name,image")
  
return res.status(200).json({success:true,notes})

} catch (error) {
  next(error)
}

}

export const DeleteNotes = async (req: Request,res: Response,next: NextFunction)=>{
try {
  const noteId = req.params.id 

const note = await Notes.findById(noteId);

if(!note){
  return res.status(404).json({success:false,message:"Notes not Found"})
}

if(note.thumbnail){
   await DeleteR2Image(note.thumbnail)
}
if(note.pdflink){
   await DeleteR2Image(note.pdflink)

}

await note.deleteOne()


return res.status(200).json({success:true,message:"Notes deleted"})
} catch (error) {
  next(error)
}
}


export const upDateNotes =async (req: Request,res: Response,next: NextFunction)=>{
  try {

const files: any = req.files;
  let thumbnail = ""; 
       let pdflink= ""
const notesId = req.params.id;
const {title,user} = req.body
if(!title || !user){
  return res.status(404).json({success:false,message:"title and user required"})
}


const note = await Notes.findById(notesId);
if(!note){
  return res.status(404).json({success:false,message:"Notes not Found"})
}



 if(files?.thumbnail || files?.thumbnail?.length > 0){
const webpBuffer = await sharp(files.thumbnail[0].buffer)
         .webp({
           quality: 80,
         })
         .toBuffer();

const filename = `notes-thumb/${crypto.randomUUID()}.webp`;

await UploadR2Image(filename,webpBuffer)
      thumbnail =  `${process.env.R2_PUBLIC_URL}/${filename}`;
           }

               if(files?.pdffile || files?.pdffile?.length > 0){

      const pdfFile = files.pdffile[0];
 if (pdfFile.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
        const filename = `notes-pdf/${crypto.randomUUID()}.pdf`;

      await UploadR2PDF(
        filename,
        pdfFile.buffer
      );

      pdflink = `${process.env.R2_PUBLIC_URL}/${filename}`;


           }


if(thumbnail){
await DeleteR2Image(note.thumbnail)

note.thumbnail=thumbnail
}

if(pdflink){
await DeleteR2Image(note.pdflink)

note.pdflink=pdflink
}


note.title=title
note.user=user

await note.save()

 return res.status(200).json({success:true,message:"user updated",note})
    
  } catch (error) {
    next(error)
  }
}




