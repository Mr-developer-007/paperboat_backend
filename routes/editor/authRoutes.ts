import express from "express";
import { loginEditor, logoutEditor, veriyit } from "../../controller/editor/editor";
import { verifyEditor } from "../../middlewere/editorVerify";
const route = express.Router();



route.post("/login",loginEditor)
route.get("/verifyeditor",verifyEditor as any, veriyit as any)
route.get("/logout",verifyEditor as any, logoutEditor as any)

export default route;

