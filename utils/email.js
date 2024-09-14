const nodemailer = require('nodemailer');
const HtmlToText = require('html-to-text');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = async({
  recipient,
  subject,
  message,
}) => {
  const mailOptions = {
    from: 'Learnify Team <learnifyt@gmail.com>',
    to: recipient,
    subject: subject,
    text: HtmlToText.htmlToText(message),
    html: message
  };
  
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;