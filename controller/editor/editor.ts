import type {NextFunction, Request, Response} from "express"
import Editor from "../../model/editorModel";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export interface EditorAuth extends Request{
    editor :any
}

export const loginEditor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const editor = await Editor.findOne({ email });

    if (!editor) {
      return res.status(404).json({
        success: false,
        message: "Editor not found",
      });
    }

    const isMatch = await bcrypt.compare(password, editor.password!);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }


    const token = jwt.sign(
      { id: editor._id },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    res.cookie("editor", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
        });

  } catch (error) {
    next(error);
  }
};


export const veriyit = async(req:EditorAuth,res: Response, next: NextFunction)=>{
  try {

    const data = req.editor
   return res.status(200).json({
      success: true,
      message: "Verified",
      data,
    });
    
  } catch (error) {
    next(error)
  }
}

export const logoutEditor= async(req:EditorAuth,res: Response, next: NextFunction)=>{
try {
  res.clearCookie("editor", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/"
})
     return res.status(200).json({
      success: true,
      message: "Editor logged out successfully"
    });
} catch (error) {
  next(error)
}
}
