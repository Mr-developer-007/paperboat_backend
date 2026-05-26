import type { NextFunction, Request, Response } from "express";
import { redisClient } from "../../helper/redis";
import Year from "../../model/yearModel";
import State from "../../model/stateModel";
import Exam from "../../model/examModels";
import Paper from "../../model/paperModel";


export const getYears = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = "year";

    const saved = await redisClient.get(key);

 
    if (saved) {
      return res.status(200).json({
        success: true,
        year: JSON.parse(saved)
      });
    }

   
    const getitem = await Year.find().sort({year:-1 });

   
    await redisClient.set(key, JSON.stringify(getitem),{  EX: 3600});

    return res.status(200).json({
      success: true,
      year: getitem,
     
    });

  } catch (error) {
    next(error);
  }
};


export const getStates= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = "state";

    // const saved = await redisClient.get(key);

 
    // if (saved) {
    //   return res.status(200).json({
    //     success: true,
    //     state: JSON.parse(saved)
    //   });
    // }

   
    const getitem = await State.find();

   
    await redisClient.set(key, JSON.stringify(getitem),{  EX: 3600});

    return res.status(200).json({
      success: true,
      state: getitem,
     
    });

  } catch (error) {
    next(error);
  }
};



export const getExams= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = "exam";

    // const saved = await redisClient.get(key);

 
    // if (saved) {
    //   return res.status(200).json({
    //     success: true,
    //     exam: JSON.parse(saved)
    //   });
    // }

   
    const getitem = await Exam.find().populate("state");

   
    await redisClient.set(key, JSON.stringify(getitem),{  EX: 3600});

    return res.status(200).json({
      success: true,
      exam: getitem,
     
    });

  } catch (error) {
    next(error);
  }
};


export const getTopViewPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const key = "toppaper";

    // const saved = await redisClient.get(key);
    // if (saved) {
    //   return res.json({
    //     success: true,
    //     papers: JSON.parse(saved),
    //   });
    // }

const papers = await Paper.find()
  .sort({ views: -1 })
  .limit(10).select(" -images ").populate("agency state year");
    // await redisClient.set(key, JSON.stringify(papers),{
    //   EX:60*60
    // });

    res.json({
      success: true,
      papers,
    });

  } catch (error) {
    next(error);
  }
};

export const getfullpaper= async( req: Request,res: Response,next: NextFunction)=>{
try {
  const {slug} =  req.params;

  const paper = await Paper.findOne({slug}).populate("agency state year");

  if(!paper){
    return res.status(400).json({success:false,message:"paper not found"})
  }
paper.view = Number(paper?.view) +1 
 await paper.save()

   return res.status(200).json({
    success:true,
    paper
   })

} catch (error) {
  next(error)
}
}

export const getPaper = async ( req: Request,res: Response,next: NextFunction)=>{
  try {
    const {page=1,state,year} = req.query
const limit = 20;
const  skip = limit * (Number(page)-1);

const filter: any = {};
 if (state) {
      filter.state = state;
    }
if (year) {
      filter.year = year;
    }

       const total = await Paper.countDocuments(filter);

       const papers = await Paper.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }).select(" -images ").populate("agency state year");;

       res.status(200).json({
      success: true,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
      papers
    });

  } catch (error) {
    next(error)
  }
}

