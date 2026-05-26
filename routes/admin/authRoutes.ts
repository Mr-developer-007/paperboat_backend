import express from "express";
import { loginAdmin, verifyAdmin, verifyOtpAdmin } from "../../controller/admin/AuthController";
import { AdminVerify } from "../../middlewere/adminVerify";
const routes = express.Router();

routes.get("/admin",AdminVerify as any,verifyAdmin as any )

routes.post("/login",loginAdmin)

routes.post("/verify",verifyOtpAdmin)



export default routes





