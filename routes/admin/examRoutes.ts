import express from "express";
import { createExam, deleteExam, getExam } from "../../controller/admin/examController";
import { multerupload } from "../../helper/MulterStore";
// import { uploadExam } from "../../helper/uploadImage";
const route = express.Router();

route.post("/create",multerupload.single("image"),createExam)
route.get("/get",getExam)
route.delete("/delete/:id",deleteExam)

export default route

