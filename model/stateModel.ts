import { Document, model } from "mongoose";
import { Schema } from "mongoose";

interface IState extends Document{
    state:string;
    image:string;
}

const stateSchema= new Schema<IState>({
    state:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
         type:String,
         required:true,
         unique:true,
    }
});



const State = model<IState>("states",stateSchema)

export default State;

