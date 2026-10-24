import type { NextFunction, Request, Response } from "express";
import { redisClient } from "../../helper/redis";
import Year from "../../model/yearModel";
import State from "../../model/stateModel";
import Exam from "../../model/examModels";
import Paper from "../../model/paperModel";
import Notes from "../../model/notesSchema";
import Article from "../../model/articleModel";
import { title } from "process";
import Editor from "../../model/editorModel";


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

    const saved = await redisClient.get(key);

 
    if (saved) {
      return res.status(200).json({
        success: true,
        state: JSON.parse(saved)
      });
    }

   
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

    const saved = await redisClient.get(key);

 
    if (saved) {
      return res.status(200).json({
        success: true,
        exam: JSON.parse(saved)
      });
    }

   
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
    const key = "toppaper";

    const saved = await redisClient.get(key);
    if (saved) {
      return res.json({
        success: true,
        papers: JSON.parse(saved),
      });
    }

const papers = await Paper.find()
  .sort({ views: -1 })
  .limit(10).select(" -images ").populate("agency state year");
    await redisClient.set(key, JSON.stringify(papers),{
      EX:60*60
    });

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




export const getTopViewNotes= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = "top-notes";

    const saved = await redisClient.get(key);
    if (saved) {
      return res.json({
        success: true,
        notes: JSON.parse(saved),
      });
    }

const notes = await Notes.find()
  .sort({ views: -1 })
  .limit(10).populate("user","name ");
  
    await redisClient.set(key, JSON.stringify(notes),{
      EX:60*60
    });

    res.json({
      success: true,
      notes,
    });

  } catch (error) {
    next(error);
  }
};



export const getPdfLink= async( req: Request,res: Response,next: NextFunction)=>{
try {
  
const notesId = req.params.id;

const notes = await Notes.findById(notesId).populate("user","name  about image contactlinks");

if(!notes){
return res.status(404).json({success:false,message:"notes not found"})
}

return res.status(200).json({success:true,notes})






} catch (error) {
  next(error)
}
}


export const getTopViewArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  try {
    const key = "toparticles";

    const saved = await redisClient.get(key);
    if (saved) {
      return res.json({
        success: true,
        articles: JSON.parse(saved),
      });
    }

const articles = await Article.find({ status:"published"})
  .sort({ views: -1 })
  .limit(10).select(" -fulldis -tags -views -readingTime").populate("editor","name");




    await redisClient.set(key, JSON.stringify(articles),{
      EX:60*60
    });

    res.json({
      success: true,
      articles,
    });

  } catch (error) {
    next(error);
  }
};


export const getFullArticle = async ( req: Request,res: Response,next: NextFunction)=>{
  try {
  const {slug} =  req.params;

  const article = await Article.findOne({slug, status:"published"}).populate("editor","name username profile");

  if(!article){
    return res.status(400).json({success:false,message:"article not found"})
  }
article.views = Number(article?.views) +1 
 await article.save()

   return res.status(200).json({
    success:true,
    article
   })

} catch (error) {
  next(error)
}
}


export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, search } = req.query;

    const limit = 20;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = limit * (currentPage - 1);

    const filter: any = {
      status:"published"
    };

    // Search by title, category, and tags
    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Total articles
    const total = await Article.countDocuments(filter);

    // Fetch articles
    const articles = await Article.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-fulldis -tags -views -readingTime")
      .populate("editor", "name");

    res.status(200).json({
      success: true,
      page: currentPage,
      total,
      totalPages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    next(error);
  }
};



export const getViewNotes= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const page = req.query.page || 1
    const search = req.query.search || ""
        const limit = 20;
    const currentPage = Math.max(1, Number(page) || 1);
    const skip = limit * (currentPage - 1);
   

    const filter: any = {
     
    };

  
    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.title=searchRegex
      
       
      
    }


     const total = await Notes.countDocuments(filter);

    

const notes = await Notes.find().skip(skip)
      .limit(limit)
  .sort({ views: -1 })
  .populate("user","name ");
  
    

    res.json({
      success: true,
      page: currentPage,
      total,
      totalPages: Math.ceil(total / limit),
      notes,
    });

  } catch (error) {
    next(error);
  }
};



export const GetEditor=async (req: Request,res: Response, next: NextFunction)=>{
  try {
    const {username} = req.params

    const editor = await Editor.findOne({username}).select("-articles -password");

    if(!editor){
      return res.status(401).json({success:false,message:"User not found"})
    }

  
const articles = await Article.find({
  editor: editor._id,
})
  .select("-fulldis -tags -views -readingTime")
  .populate("editor", "name");
    return res.status(200).json({success:true,editor,articles});



  } catch (error) {
    next(error)
  }
}


