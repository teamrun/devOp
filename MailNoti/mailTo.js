(function() {
  var config, mailTo, nodemailer, smtpTransport;

  nodemailer = require("nodemailer");

  config = require('./mailConfig');

  smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: config.gmail,
      pass: config.pass
    }
  });

  mailTo = function(option) {
    var mailOptions;
    mailOptions = {
      from: "Chenllos " + config.gmail,
      to: option.to || config.defaultReciever,
      subject: option.subject,
      html: option.html
    };
    return smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        return console.log(error);
      } else {
        return console.log("Message sent: " + response.message);
      }
    });
  };

  exports.mailTo = mailTo;

}).call(this);
