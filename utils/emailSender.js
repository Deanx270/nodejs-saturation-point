const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token, firstName, lastName) => {
  const verificationUrl = `http://localhost:${process.env.PORT || 3000}/api/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: '"The Saturation Point" <no-reply@thesaturationpoint.com>',
    to: toEmail,
    subject: 'Welcome to The Saturation Point - Verify Your Email',
    html: `
      <div style="font-family: 'Cormorant Garamond', serif; color: #2D3436; text-align: center; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; padding: 40px; background-color: #FAF9F6;">
        <h1 style="color: #1B263B; font-size: 32px; margin-bottom: 20px;">The Saturation Point</h1>
        <h2 style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 18px; color: #636E72; margin-bottom: 40px;">Hello ${firstName} ${lastName}, please verify your email address</h2>
        <p style="font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
          Thank you for registering an account with us. To complete your registration and gain access to our premium catalog, please click the button below to verify your email address.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #1B263B; color: #ffffff; text-decoration: none; padding: 12px 24px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">Verify Email Address</a>
        <p style="font-family: 'Inter', sans-serif; font-size: 12px; color: #636E72; margin-top: 40px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
