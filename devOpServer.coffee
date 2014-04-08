http = require 'http'
url = require "url"
qs = require 'querystring'

sendMail = require('./mailTo').mailTo
autoDeploy = require './deploy'

autoDeploy()

s = http.createServer (req, res) ->
    res.writeHead('200', {'contentType': 'text/plain'})
    res.end('hello, node mailer')
    switch req.method.toLowerCase()
        when 'post' then postHandler req,res
        when 'get'  then getHandler req,res


s.listen 2500
console.log 'mail server is listening at 2500'

postHandler = (req, res) ->
    data = '';
    req.on 'data', (chunk) ->
        data += chunk
    req.on 'end', ->
        param = qs.parse data
        return false if not param.html
        sendMail( consOption param )

getHandler = (req, res) ->
    param = qs.parse( url.parse( req.url ).query );
    return false if not param.html
    sendMail( consOption param )


consOption = ( param ) ->
    return {
        from: param.from,
        to: param.to,
        subject: param.subject
        html: param.html
    }

