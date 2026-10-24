
import express from "express";
// import { uploadState } from "../../helper/uploadImage";
import { createState, deletState, getState } from "../../controller/admin/stateController";
import { multerupload } from "../../helper/MulterStore";

const route = express.Router()

route.post("/create",multerupload.single("stateimage"),createState)
route.get("/get",getState)
route.delete("/delete/:id",deletState)
export default route