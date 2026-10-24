import { Document, model, Schema } from "mongoose";

interface IEditor extends Document{
   name:string;
    username:string;
    password:string;
    email:string;
    number:string;
    profile:string;
    status:Boolean
    articles:Schema.Types.ObjectId[];
}


const editorSchema = new Schema<IEditor>({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true  
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
         required:true,
    },
    number:{
         type:String,
         required:true,
         min:10
    },
    profile:{
       type:String,
      default:null
    },
    status:{
        type:Boolean,
        default:true
    },
    articles:[
        {
            type:Schema.Types.ObjectId,
            ref:"articles"
        }
    ],


},{
    timestamps:true
})

const Editor =  model<IEditor>("editor",editorSchema);

export default Editor
