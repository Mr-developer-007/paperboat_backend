import { Document, model, Schema } from "mongoose";

interface IYear extends Document{
  year:Number
}

const yearSchema = new Schema<IYear>({
    year:{
        type:Number,
        required:true,
        unique:true
    }
})

const Year = model<IYear>("year",yearSchema)

export default Year;