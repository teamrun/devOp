var cmd = require('child_process').spawn;

// cmd();

var i=0;
var restartTime = 0;
setInterval(function(){
  console.log(i++);
  var pm2List = cmd('pm2', ['jlist']);
  pm2List.stdout.on('data', function(data){
    var resultJSON = JSON.parse(data.toString());
    restartTime = resultJSON[0].pm2_env.restart_time;
  });
}, 5*1000);



var http = require('http');

var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!\n ' + restartTime);
});

var port = 3030;

if( process.argv[2] ){
  port = process.argv[2];
}

server.listen(port);

console.log('server listen ing at: ', port);
console.log(__filename);


// clone or pull
// check is any updates
// npm install
// build
// copy
// change soft link
// move to backup folder