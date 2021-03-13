const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    console.log(process.env.EMAIL_HOST, transporter);

    const mailOptions = {
      from: `Ayush Kumar <${process.env.EMAIL_FROM}>`, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.message, // plain text body
      // html: '<b>Hello world?</b>', // html body
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err)
  }

};

module.exports = sendEmail;
