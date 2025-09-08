import { htmlVersionEmailTemplate, textVersionEmailTemplate } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendOtpEmail = async({to, otpCode}) => {
  if(!to) throw new Error('Reciepient address not provided');

  const textVersion = textVersionEmailTemplate(otpCode);
  const htmlVersion = htmlVersionEmailTemplate(otpCode);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: 'OTP Code',
    text: textVersion,
    html: htmlVersion
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error, 'Error sending email');

    console.log('Email sent: ', info.response);
  })
}