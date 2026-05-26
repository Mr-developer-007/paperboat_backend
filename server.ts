import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import { errorHandler } from "./middlewere/errorHandler";
import  cookieParser from "cookie-parser"

import yearRoutes from "./routes/admin/yearRoutes"
import stateRoutes from "./routes/admin/stateRoute"
import examRoutes from "./routes/admin/examRoutes"
import paperRoutes from "./routes/admin/paperRoutes"
import editorRoutes from "./routes/admin/editorRoutes"
import authRoutes from "./routes/admin/authRoutes"



import Year from "./routes/user/yearstates"


import EditorAuth from "./routes/editor/authRoutes"
import articleRoutes from "./routes/editor/articleRoute"

import cors from "cors"
import { connectRedis } from "./helper/redis";
import { AdminVerify } from "./middlewere/adminVerify";
dotenv.config()


const app = express()
app.use(cookieParser())
app.use(cors({
    origin:[process.env.FRONTEND_URL!],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.json({ok:"okkk"})
})





app.use("/api/v1/user/get",Year);




app.use("/api/v1/admin/year",AdminVerify as any,yearRoutes)
app.use("/api/v1/admin/state",AdminVerify as any,stateRoutes)
app.use("/api/v1/admin/exam",AdminVerify as any,examRoutes)
app.use("/api/v1/admin/paper",AdminVerify as any,paperRoutes);
app.use("/api/v1/admin/editor",AdminVerify as any,editorRoutes);
app.use("/api/v1/admin/auth",authRoutes);


//////   --->>>> Editor <<<<---  //////

app.use("/api/v1/editor/auth",EditorAuth)
app.use("/api/v1/editor/article",articleRoutes)










app.use(errorHandler); 


const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URL2!).then(()=>{
    connectRedis()
    app.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`)
    })
})

