import {S3Client,PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

const s3= new S3Client({

      region: "auto",
  endpoint: "https://8c450b79c032340da0c647276d109e7e.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

 export const UploadR2Image=async(filepath : string,fileStream  : any)=>{
      try {


          const command = new PutObjectCommand({
    Bucket: "firstbuck",
    Key: filepath,
    Body: fileStream,
    ContentType: "image/webp",
  });

  await s3.send(command);


      } catch (error) {
        console.log(error)
      }
}


export const DeleteR2Image = async(filepath : string)=>{
     const imageKey = filepath.split(".dev/")[1];
     await s3.send(
      new DeleteObjectCommand({
        Bucket: "firstbuck",
        Key: imageKey,
      })
    );
}
