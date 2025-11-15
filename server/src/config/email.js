import nodemailer from 'nodemailer';

// Create transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASSWORD // your app password
  }
});

// Email templates
export const emailTemplates = {
  welcome: (firstName) => ({
    subject: 'Welcome to BaseConnect! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Welcome to BaseConnect!</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Hi ${firstName || 'there'},</p>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Thank you for signing up! We're excited to have you on board. 
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Get started by completing your profile and exploring available tasks.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.CLIENT_URL}/onboarding" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Complete Your Profile
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} BaseConnect. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  resetPassword: (otp) => ({
    subject: 'Reset Your Password - BaseConnect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            You requested to reset your password. Use the OTP code below to proceed:
          </p>
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your OTP Code:</p>
            <h2 style="font-size: 36px; letter-spacing: 8px; color: #2563eb; margin: 0; font-family: 'Courier New', monospace;">
              ${otp}
            </h2>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">
            This code will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} BaseConnect. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template) => {
  try {
    await transporter.sendMail({
      from: `"BaseConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};