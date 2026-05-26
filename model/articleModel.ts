import mongoose, { Document, model, Schema } from "mongoose";

interface IFullDis {
title:string;
description:string;
image:string;
}


interface IArticle extends Document{
title:string;
slug:string;
description:string;
featuredImage:string;
editor:mongoose.Schema.Types.ObjectId;
tags:string[];
status:string;
views:Number;
readingTime:Number;
category:string;
fulldis: IFullDis[];
}



const articleSchema = new Schema<IArticle>({
     title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "editor",
      required: true,
    },
     tags: [
      {
        type: String,
        trim: true,
      },
    ],
      status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
     views: {
      type: Number,
      default: 0,
    },
     readingTime: {
      type: Number, 
    },
    category:{
         type: String,
         required:true
    },
 fulldis:[
    {
        title:{ type:String},
        description:{type:String},
        image:{type:String}
    }
 ]


},{
      timestamps: true,
})
articleSchema.index({
  title: "text",
  category: "text",
  
});

const Article = model<IArticle>("articles",articleSchema)

export default Article