import * as nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.sendgrid.net",
  port: parseInt(process.env.SMTP_PORT ?? "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASSWORD ?? "",
  },
});

export default mailer;
