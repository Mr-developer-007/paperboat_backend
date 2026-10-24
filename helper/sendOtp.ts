import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Note: Template literals aren't strictly needed if it's just the variable
    user: process.env.EMAIL,  
    pass: process.env.EMAILPASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      // Formatted sender name
      from: `"Paper Boat" <${process.env.EMAIL}>`, 
      to: email,
      subject: "Your Admin Portal Verification Code",
      text: `Your Paper Boat OTP is: ${otp}. It is valid for 10 minutes.`, // Plain text fallback
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="background-color: #f9fafb; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 40px 20px; margin: 0; text-align: center;">
          
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); text-align: left;">
            
            <div style="padding: 32px 32px 0 32px; text-align: center;">
              <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 700;">Paper Boat</h2>
              <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Admin Portal Authentication</p>
            </div>
            
            <div style="padding: 32px;">
              <p style="color: #374151; font-size: 16px; line-height: 24px; margin-top: 0;">Hello,</p>
              <p style="color: #374151; font-size: 16px; line-height: 24px;">Please use the verification code below to sign in to your account. This code is valid for <strong>10 minutes</strong>.</p>

              <div style="background-color: #f4f6ff; border: 1px solid #e0e7ff; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 8px;">${otp}</span>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-bottom: 0;">If you didn't request this email, you can safely ignore it. Your account remains secure.</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Paper Boat. All rights reserved.</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>

          </div>
          
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, message: "OTP sent successfully" };
    
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: "Failed to send OTP email" };
  }
};


