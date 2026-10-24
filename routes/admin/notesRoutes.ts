import express from "express";
import { CreateNotes, createNotesUser, DeleteNotes, DeleteUser, getNotes, getNotesUser, getNoteUser, upDateNotes } from "../../controller/admin/NotesController";
import { multerupload } from "../../helper/MulterStore";


const route = express.Router();


route.post("/user/create",multerupload.single("image"),createNotesUser as any)
route.get("/users/get",getNotesUser)
route.get("/user/get/:id",getNoteUser)
route.delete("/user/:id",DeleteUser)

route.post("/create",multerupload.fields([{name:"thumbnail",maxCount:1},{name:"pdffile",maxCount:1}]),CreateNotes)
route.get("/get",getNotes)
route.delete("/delete/:id",DeleteNotes)

route.put("/update/:id",multerupload.fields([{name:"thumbnail",maxCount:1},{name:"pdffile",maxCount:1}]),upDateNotes)



// 
export default route