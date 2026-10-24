import  type { NextFunction, Request, Response } from "express";
import Year from "../../model/yearModel";


export const createYear= async(req:Request,res:Response,next:NextFunction)=>{
try {
   const {year} = req.body;
   
   const allready = await Year.findOne({year})

   if(allready){
      const error = new Error("Year allready exist") as any;
      error.statusCode = 404;
      throw error;
   }

const newyear=    await Year.create({year})
return res.status(201).json({
    success:true,
    message:"Year added",
year:newyear
})

} catch (error) {
    next(error)
}
}

export const getAllYears= async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const years = await Year.find().sort({year:-1})
        return res.status(200).json({success:true,years})

    } catch (error) {
        next(error)
    }
}


export const deleteYear= async(req:Request,res:Response,next:NextFunction)=>{
    try {
const id= req.params.id;
if(!id){
    const error = new Error("Year Not exist") as any;
      error.statusCode = 404;
      throw error; 
}


await Year.findByIdAndDelete(id)

 return res.status(200).json({success:true,message:"Year removed"})
        
    } catch (error) {
        next(error)
    }
}