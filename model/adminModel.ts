import { Document, model, Schema } from "mongoose";

interface IAdmin extends Document{
    email:String;
    password:String
}


const adminSchema = new Schema<IAdmin>({
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    require:true
}


},{
    timestamps:true
})


const Admin = model<IAdmin>("admin",adminSchema)

export default Admin;





