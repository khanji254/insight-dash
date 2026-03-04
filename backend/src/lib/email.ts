import nodemailer from 'nodemailer';
import { env } from '../config/env';

// Create reusable transporter
export const createTransporter = () => {
  // For development, use Ethereal Email (fake SMTP service)
  // For production, configure with real SMTP credentials
  if (env.NODE_ENV === 'development') {
    // In development, log emails to console instead of sending
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025, // MailHog/MailDev default port
      ignoreTLS: true,
    });
  }

  // Production: Use environment variables for SMTP config
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async (email: string, otpCode: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || 'InsightDash <noreply@insightdash.ke>',
    to: email,
    subject: 'Verify Your Email - InsightDash',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #2563eb;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-code {
              background-color: #fff;
              border: 2px dashed #2563eb;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              margin: 20px 0;
              color: #2563eb;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>InsightDash Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with InsightDash. To complete your registration, please use the following verification code:</p>
              
              <div class="otp-code">${otpCode}</div>
              
              <p>This code will expire in 15 minutes.</p>
              
              <p><strong>Note:</strong> After email verification, your account will be reviewed by an administrator before you can log in.</p>
              
              <p>If you didn't request this verification code, please ignore this email.</p>
              
              <div class="footer">
                <p>InsightDash - Kenya Political Finance Transparency Platform</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      InsightDash Email Verification
      
      Thank you for registering with InsightDash.
      
      Your verification code is: ${otpCode}
      
      This code will expire in 15 minutes.
      
      Note: After email verification, your account will be reviewed by an administrator before you can log in.
      
      If you didn't request this verification code, please ignore this email.
      
      InsightDash - Kenya Political Finance Transparency Platform
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the email
    if (env.NODE_ENV === 'development') {
      console.log('📧 Email sent to:', email);
      console.log('🔐 OTP Code:', otpCode);
      console.log('Message ID:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendAccountApprovedEmail = async (email: string, name: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || 'InsightDash <noreply@insightdash.ke>',
    to: email,
    subject: 'Account Approved - InsightDash',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10b981;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .cta-button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Account Approved!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Great news! Your InsightDash account has been approved by our administrator.</p>
              
              <p>You can now log in and access all features of the platform.</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" class="cta-button">
                Log In Now
              </a>
              
              <p>If you have any questions, please contact our support team.</p>
              
              <div class="footer">
                <p>InsightDash - Kenya Political Finance Transparency Platform</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Account Approved!
      
      Hello ${name},
      
      Great news! Your InsightDash account has been approved by our administrator.
      
      You can now log in and access all features of the platform.
      
      Visit: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/login
      
      If you have any questions, please contact our support team.
      
      InsightDash - Kenya Political Finance Transparency Platform
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (env.NODE_ENV === 'development') {
      console.log('📧 Approval email sent to:', email);
      console.log('Message ID:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send approval email:', error);
    throw new Error('Failed to send approval email');
  }
};
