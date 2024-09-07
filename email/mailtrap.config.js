
require('dotenv').config();
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");


const mailClient = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

const sender = {
  address: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test-Nuy",
};

module.exports = {
  mailClient,
  sender
}
  