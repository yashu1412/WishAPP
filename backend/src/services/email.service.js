const nodemailer = require("nodemailer");
const { ApiError } = require("../utils/ApiError");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use Google App Password here
  },
});

/**
 * Send an email using Gmail SMTP
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html = "") => {
  try {
    const mailOptions = {
      from: `"Wishes App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new ApiError(500, "Could not send email");
  }
};

module.exports = { sendEmail };
