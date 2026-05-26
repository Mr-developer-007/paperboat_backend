import express from "express";
import { CreateEditor, deleteEditor, getEditor } from "../../controller/admin/editorController";

const route = express.Router();

route.post(`/create`,CreateEditor)
route.get("/get",getEditor)
route.delete("/delete/:id",deleteEditor)
export default route