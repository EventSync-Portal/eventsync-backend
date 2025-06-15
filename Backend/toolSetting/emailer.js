const nodemailer = require("nodemailer");

exports.sendEmail = (to, subject, text, html) => {
  return new Promise((resolve, reject) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      const errMsg =
        "Email credentials (EMAIL_USER or EMAIL_PASS) are not set in environment variables.";
      console.error(errMsg);
      return reject(new Error(errMsg));
    }

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: user,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        reject(error);
      } else {
        console.log("Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
};
