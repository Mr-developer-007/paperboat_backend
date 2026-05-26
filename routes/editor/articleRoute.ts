import express from "express";
import { createArticle } from "../../controller/editor/articleController";
import { verifyEditor } from "../../middlewere/editorVerify";
import { multerupload } from "../../helper/MulterStore";

const route = express.Router();


route.post("/create",verifyEditor as any,multerupload.fields([{ name: "featuredImage", maxCount: 1 },
    { name: "sectionImages", maxCount: 20 },]), createArticle as any)

export default route
