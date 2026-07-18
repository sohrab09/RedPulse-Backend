// services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendVerificationEmail(email, code) {
    const mailOptions = {
        from: `"RedPulse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - RedPulse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #dc2626;">RedPulse Email Verification</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="color: #dc2626; letter-spacing: 4px; margin: 0; font-size: 32px;">${code}</h1>
                </div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p style="color: #6b7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };