import express from "express";
import { createArticle, getMyArticle, getSingleArticle, UpdateArticle } from "../../controller/editor/articleController";
import { verifyEditor } from "../../middlewere/editorVerify";
import { multerupload } from "../../helper/MulterStore";

const route = express.Router();


route.post("/create",verifyEditor as any,multerupload.fields([{ name: "featuredImage", maxCount: 1 },
    { name: "sectionImages", maxCount: 20 },]), createArticle as any)

  route.get("/articles",verifyEditor as any,getMyArticle as any)  

  route.get("/article/:slug",verifyEditor as any,getSingleArticle as any)  
  
  route.put("/update/:id",verifyEditor as any,
    multerupload.fields([{ name: "newfeaturedImage", maxCount: 1 },
    { name: "sectionImages", maxCount: 20 },]),
    UpdateArticle as any)



export default route
