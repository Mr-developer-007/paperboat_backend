import mongoose, { Document, model, Schema } from "mongoose";


interface IPaper extends Document{
  name:string;
  slug:string;
  agency:mongoose.Schema.Types.ObjectId;
   year:mongoose.Schema.Types.ObjectId;
    state:mongoose.Schema.Types.ObjectId;
  thumbnail:string;
  images:string[];
  description?:string;
  isActive:Boolean;
  view:Number;

}


const paperSchema= new Schema<IPaper>({
    name:{
        type:String,
        required:true
    },
    slug:{
      type:String,
        required:true,
        unique:true,  
    },
    agency:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"exam"
    },
    
    year: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"year",
       required:true,
    },
    state: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"states",
      required:true,
    },
    view:{
      type:Number,
default:0
    },
    thumbnail:{
      type:String,
      required:true
    },
    images:[String],
    description: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
})


const Paper = model<IPaper>("paper",paperSchema)

export default Paper
