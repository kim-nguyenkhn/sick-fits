const nodemailer = require("nodemailer");

// Transport is essentially a one-way email sending
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// TODO: Add some sort of email templating here, e.g., MJML

const makeANiceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>Love, Kim Nguyen</p>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
