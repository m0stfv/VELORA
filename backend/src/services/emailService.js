const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

async function sendResetPasswordEmail(to, resetUrl) {
  const mailer = getTransporter();

  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #f6f3ec; color: #2a2823;">
      <p style="font-size: 20px; letter-spacing: 4px; margin: 0 0 32px; text-align: center;">VELORA</p>
      <h2 style="font-size: 22px; font-weight: 400; margin: 0 0 16px;">Reset your password</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #5c584f; margin: 0 0 28px;">
        We received a request to reset your password. Click the button below to choose a new one.
        This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.
      </p>
      <a href="${resetUrl}" style="display: inline-block; background: #2a2823; color: #f6f3ec; text-decoration: none; padding: 12px 28px; font-size: 13px; letter-spacing: 1px;">
        RESET PASSWORD
      </a>
      <p style="font-size: 12px; color: #8b8574; margin-top: 32px;">
        If the button doesn't work, copy this link into your browser:<br/>
        <span style="word-break: break-all;">${resetUrl}</span>
      </p>
    </div>
  `;

  await mailer.sendMail({
    from: `"VELORA" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your VELORA password',
    html,
  });
}

module.exports = { sendResetPasswordEmail };
