(function() {
  var autoDeploy, consOption, getHandler, http, postHandler, qs, s, sendMail, url;

  http = require('http');

  url = require("url");

  qs = require('querystring');

  sendMail = require('./mailTo').mailTo;

  autoDeploy = require('./deploy');

  autoDeploy();

  s = http.createServer(function(req, res) {
    res.writeHead('200', {
      'contentType': 'text/plain'
    });
    res.end('hello, node mailer');
    switch (req.method.toLowerCase()) {
      case 'post':
        return postHandler(req, res);
      case 'get':
        return getHandler(req, res);
    }
  });

  s.listen(2500);

  console.log('mail server is listening at 2500');

  postHandler = function(req, res) {
    var data;
    data = '';
    req.on('data', function(chunk) {
      return data += chunk;
    });
    return req.on('end', function() {
      var param;
      param = qs.parse(data);
      if (!param.html) {
        return false;
      }
      return sendMail(consOption(param));
    });
  };

  getHandler = function(req, res) {
    var param;
    param = qs.parse(url.parse(req.url).query);
    if (!param.html) {
      return false;
    }
    return sendMail(consOption(param));
  };

  consOption = function(param) {
    return {
      from: param.from,
      to: param.to,
      subject: param.subject,
      html: param.html
    };
  };

}).call(this);
