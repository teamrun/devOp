var fs = require('fs');

var folderPath = '/var/chenllos/blog/current/blog_'+Date.now();

var mkResult = fs.mkdirSync(folderPath);
console.log( mkResult );