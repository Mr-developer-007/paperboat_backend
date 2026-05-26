import type { NextFunction, Request, Response } from "express"
import Admin from "../../model/adminModel"
import bcrypt from "bcrypt"
import { redisClient } from "../../helper/redis"
import { sendOTP } from "../../helper/sendOtp"
import JWT from "jsonwebtoken"

export const loginAdmin = async (req: Request,res: Response,  next:NextFunction) => {
  try {
    const { email, password } = req.body;
 

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const comparePassword = await bcrypt.compare(
      password,
      admin.password as string
    );

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await redisClient.set(
      `otp:${admin._id}`,
      otp.toString(),
      {
        EX: 300, // 5 minutes
      }
    );

    await sendOTP(admin.email as string, otp.toString());

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
     
    });
  } catch (error: any) {
    console.error(error);

  next(error)
  }
};


export const verifyOtpAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, password and OTP are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password as string
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const savedOtp = await redisClient.get(`otp:${admin._id}`);

    if (!savedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (savedOtp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Remove OTP after successful verification
    await redisClient.del(`otp:${admin._id}`);

    const token = JWT.sign(
      { id: admin._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    res.cookie("admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
  
     
    });
  } catch (error) {
    next(error);
  }
};


export interface AdminAuth extends Request{
    admin :any
}
export const verifyAdmin = async( req: AdminAuth,res: Response,next: NextFunction)=>{
try {
  
const admin = req.admin

  return res.json({
    success:true,admin
  })


} catch (error) {
  next(error)
}
}



