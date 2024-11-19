"use strict";
const config = require("../../../config.json");
const nodemailer = require("nodemailer");

async function mail_to(email, title, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.mailer[config.mailer.used].host,
      port: config.mailer[config.mailer.used].port,
      secure: false,
      auth: {
        user: config.mailer[config.mailer.used].user,
        pass: config.mailer[config.mailer.used].pass,
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    const send = await transporter.sendMail({
      from: config.mailer[config.mailer.used].user,
      to: email,
      subject: title,
      subject: subject,
      html: message,
    });

    console.log("email > ", send);

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

module.exports = { mail_to };
