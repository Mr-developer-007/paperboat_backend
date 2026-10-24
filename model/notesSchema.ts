import mongoose, { Document, model, Schema } from "mongoose";


interface INotes extends Document{
    title:string;
    thumbnail:string;
    pdflink:string;
    user:Schema.Types.ObjectId;
view:Number;
}


const notesSchema = new Schema<INotes>({
    title:{
        type:String,
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
    pdflink:{

     type:String,
required:true   
    },

    user:{
        type:Schema.Types.ObjectId,
        ref:"NoteUser"
    }

},{
    timestamps:true
})


const Notes = model<INotes>("Note",notesSchema)

export default Notes;