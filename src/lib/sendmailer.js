// const nodemailer=require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //     service:'gmail',
// //     host: process.env.SMTP_HOST,
// //     port: process.env.SMTP_PORT,
// //     secure:true,
// //     auth: {
// //       user: process.env.SMTP_MAIL,
// //       pass: process.env.SMTP_PASSWORD,
// //     },
//

// module.exports = transporter

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export {sgMail}