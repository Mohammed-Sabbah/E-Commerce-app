const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
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