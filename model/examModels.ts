import { Document, model, Schema } from "mongoose";
interface IExam extends Document{
    name:String;
    slug:String;
    logo:String;
    view:Number;
state:Schema.Types.ObjectId;
}

const examSchema= new Schema<IExam>({
     name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
      logo: {
      type: String,
      required: true,

    },
    view:{
        type:Number,
        default:0,
    },
    state:{
        type:Schema.Types.ObjectId,
        ref:"states"
    }

})

const Exam = model<IExam>("exam",examSchema)

export default Exam