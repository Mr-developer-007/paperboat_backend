import express from "express";
import { getExams, getfullpaper, getPaper, getStates, getTopViewPaper, getYears } from "../../controller/user/StateandYearController";
const route = express.Router();

route.get("/year",getYears)

route.get("/states",getStates)
route.get("/exams",getExams)
route.get("/toppaper",getTopViewPaper)
route.get("/getpaper/:slug",getfullpaper)

route.get("/papers",getPaper)
 
export default route

