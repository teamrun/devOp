nodemailer = require "nodemailer"
config = require './mailConfig'

smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: config.gmail,
        pass: config.pass
    }
});

mailTo = ( option ) ->
    mailOptions = {
        from: "Chenllos " + config.gmail,
        to: option.to || config.defaultReciever,
        subject: option.subject,
        html: option.html
    }

    smtpTransport.sendMail( mailOptions, (error, response)->
        if error
            console.log(error);
        else
            console.log("Message sent: " + response.message);
    );

exports.mailTo = mailTo