const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT || '2525', 10),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send password reset email to user.
   * @param {object} options - Email sending options.
   * @param {string} options.email - User email.
   * @param {string} options.name - User name.
   * @param {string} options.resetUrl - The reset password URL link.
   * @param {number} [options.expireMinutes=10] - Token expiration duration in minutes.
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail({ email, name, resetUrl, expireMinutes = 10 }) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Disha for India <noreply@dishaforindia.org>',
      to: email,
      subject: 'Password Reset Request - Disha for India',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a73e8; text-align: center;">Disha for India</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset the password for your Disha for India account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>This password reset link is valid for <strong>${expireMinutes} minutes</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #757575; line-height: 1.5;">
            If you're having trouble clicking the button, copy and paste the URL below into your web browser:<br>
            <a href="${resetUrl}" style="color: #1a73e8; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 12px; color: #757575; text-align: center;">
            <strong>Support Information:</strong> If you need any assistance, contact our technical team at <a href="mailto:support@dishaforindia.org" style="color: #1a73e8;">support@dishaforindia.org</a>.
          </p>
        </div>
      `,
    };

    // If using mock credentials, fall back to console log to prevent SMTP connection errors during testing
    if (
      !process.env.EMAIL_USERNAME ||
      process.env.EMAIL_USERNAME === 'your_smtp_username' ||
      process.env.EMAIL_USERNAME === 'mock_smtp_username'
    ) {
      /* eslint-disable no-console */
      console.log('--- EMAIL MOCK LOG ---');
      console.log(`To: ${email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('----------------------');
      /* eslint-enable no-console */
      return;
    }

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
