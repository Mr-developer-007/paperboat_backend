import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,  
    pass: `${process.env.EMAILPASS}`,
  },
});

/**
 * Sends login credentials to the user via email.
 */
export const sendCredentials = async (email: string, password: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Paper Boat" <${process.env.EMAIL}>`, // Best practice for the 'from' field
      to: email,
      subject: "Your Login Credentials",           // Fixed typo
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0056b3;">Welcome to Paper Boat!</h2>
          <p>Hello,</p>
          <p>Your account has been successfully set up. Here are your login credentials:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0 0 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p><em>For your security, we highly recommend changing your password immediately after your first login.</em></p>
          <br/>
          <p>Best regards,<br/><strong>The Paper Boat Team</strong></p>
        </div>
      `,
    });


  } catch (error) {
    console.error("Error sending credentials email:", error);
    return { success: false, error };
  }
};