import type { NextFunction, Request, Response } from "express";
import { sendCredentials } from "../../helper/sendMail";
import Editor from "../../model/editorModel";
import bcrypt from "bcrypt"

export const CreateEditor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, number } = req.body;

    const alreadyEditor = await Editor.findOne({ email });

    if (alreadyEditor) {
      return res.status(400).json({
        success: false,
        message: "Editor already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create username
    const username = `${name}-${Date.now()}`;

    // Create editor
    const newEditor = await Editor.create({
      name,
      email,
      password: hashPassword,
      number,
      username,
    });

    await sendCredentials(email, password);

    return res.status(201).json({
      success: true,
      message: "Editor created successfully",
      data: newEditor,
    });

  } catch (error) {
    next(error);
  }
}

export const getEditor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const editor = await Editor.find();

    return res.status(200).json({
      success: true,
      count: editor.length,
      data: editor,editor
    });

  } catch (error) {
    next(error);
  }
};


export const deleteEditor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const editor = await Editor.findById(id);

    if (!editor) {
      return res.status(404).json({
        success: false,
        message: "Editor not found",
      });
    }

    await editor.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Editor deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};