const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true لو بورت 465 (SSL)، false لباقي البورتات (587 STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let sendResetPasswordEmail = async function (options) {
    await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.emailBody
    });
}

module.exports = { sendResetPasswordEmail };