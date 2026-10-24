import express from "express";
import { createYear, deleteYear, getAllYears } from "../../controller/admin/yearController";

const route = express.Router()
route.post("/create",createYear)
route.get("/get",getAllYears)
route.delete("/delete/:id",deleteYear)
export default route