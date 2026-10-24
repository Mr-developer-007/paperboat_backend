import express from "express";
import { getArticles, GetEditor, getExams, getFullArticle, getfullpaper, getPaper, getPdfLink, getStates, getTopViewArticles, getTopViewNotes, getTopViewPaper, getViewNotes, getYears } from "../../controller/user/StateandYearController";
const route = express.Router();

route.get("/year",getYears)

route.get("/states",getStates)
route.get("/exams",getExams)
route.get("/toppaper",getTopViewPaper)
route.get("/getpaper/:slug",getfullpaper)

route.get("/papers",getPaper)
 
 route.get("/topnotes",getTopViewNotes)
  route.get("/allnotes",getViewNotes)

 route.get("/notes/:id",getPdfLink)

 

 route.get("/toparticles",getTopViewArticles)
 route.get("/article/:slug",getFullArticle)

route.get("/articles",getArticles)



route.get("/editor/:username",GetEditor)


export default route

