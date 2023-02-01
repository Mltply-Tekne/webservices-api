const nodemailer = require("nodemailer");

var emailUsername = process.env.emailUsername
var emailPassword = process.env.emailPassword
var emailFrom = process.env.emailFrom
var emailReceivers = process.env.emailReceivers


let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: emailUsername, // generated ethereal user
        pass: emailPassword, // generated ethereal password
    },
})

async function sendErrorEmail (errorText) {

    if (process.env.sendErrorEmails != 'false') {
        let info = await transporter.sendMail({
            from: `"API Error" <${emailFrom}>`, // sender address
            to: emailReceivers, // list of receivers
            subject: `${process.env.instanceName} - ${process.env.environment}`, // Subject line
            text: errorText, // plain text body
        });
    
        console.log("Email sent: %s", info.messageId);
    } else {
        console.log('Email was not sent, because of the config')
    }
    
}

async function sendCustomEmail (text, subject, to, from, fromName) {

    let info = await transporter.sendMail({
        from: `${fromName} <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });

    console.log('Custom email sent!')
}

async function sendCustomHtmlEmail (html, subject, to, from, fromName) {

    let info = await transporter.sendMail({
        from: `${fromName} <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // plain text body
    });

    console.log('Custom email sent!')
}

module.exports = {sendErrorEmail, sendCustomEmail, sendCustomHtmlEmail}