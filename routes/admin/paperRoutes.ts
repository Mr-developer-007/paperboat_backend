import express from "express";
import { createPaper, deletePaper, editPaper, getPaper, getSinglePaper, getView, saveDrage } from "../../controller/admin/paperController";
import { multerupload } from "../../helper/MulterStore";

const route = express.Router();

route.post("/create",multerupload.fields([
    {name:"thumbnail",maxCount:1},
    {name:"images"}
]),createPaper)
 

route.get("/get",getPaper)
route.get("/edit/:slug",getSinglePaper)


route.get("/view/:slug",getView)

route.put("/edit/:slug",multerupload.fields([
     { name: "newthumbnail", maxCount: 1 },
 { name: "newimage"} 
]),editPaper)


route.put("/drageimage/:slug",saveDrage)

route.delete("/delete/:id",deletePaper)
export default route