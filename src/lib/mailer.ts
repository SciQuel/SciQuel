import * as nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY ?? "",
  },
});

export default mailer;
