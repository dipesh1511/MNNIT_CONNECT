

import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the email transporter once for all email actions
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Send Signup Email
export const signupEmail = async (req, res) => {
  const { email, code } = req.body;

  // Check if email ends with @mnnit.ac.in
  if (!email.endsWith('@mnnit.ac.in')) {
    return res.status(400).json({ error: 'Email must end with @mnnit.ac.in' });
  }

  try {
    // Read the HTML template for the email
    const templatePath = path.join(__dirname, '../emails/signup.html');

    // Check if the template exists
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ error: 'Email template not found' });
    }

    // Read and modify the email template
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');
    emailTemplate = emailTemplate.replace('{{OTP}}', code);

    // Set up email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender's email
      to: email,                    // Recipient's email
      subject: 'Registration OTP',  // Subject line
      html: emailTemplate,          // HTML body with OTP
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send success response
    return res.status(200).json({ message: 'Verification code sent successfully' });

  } catch (error) {
    console.error('Error sending signup email:', error);
    return res.status(500).json({ error: 'Error sending email' });
  }
};

// Send Feedback Email
export const sendFeedback = async (req, res) => {
  const { name, email, message } = req.body;

  // Create HTML content for the feedback email (Improved UI)
  const emailHTMLContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #333;">Feedback from MNNIT Connect</h2>
          <hr style="border: 1px solid #f0f0f0;" />
          
          <div style="font-size: 16px; line-height: 1.6; color: #333;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; color: #555;">${message}</p>
          </div>
          
          <hr style="border: 1px solid #f0f0f0;" />
          <p style="text-align: center; font-size: 14px; color: #888;">This message was sent from the MNNIT Connect platform.</p>
        </div>
      </body>
    </html>
  `;

  // Set up the email options for feedback
  const mailOptions = {
    from: process.env.GMAIL_USER,                // Sender's email
    to: "asneha1412@gmail.com",                  // Receiver's email
    subject: 'Feedback from MNNIT Connect',      // Subject line
    html: emailHTMLContent,                     // HTML content
  };

  try {
    // Send the feedback email
    await transporter.sendMail(mailOptions);

    // Send success response
    return res.status(200).json({ success: true, message: "Feedback sent successfully!" });

  } catch (error) {
    console.error('Error sending feedback email:', error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

