var fs = require('fs');
var path = require('path');
var run = require('child_process').spawnSync;
var logger = require('bragi');

var log = logger.log;

function getHome(){
  return process.env[(process.platform =='win32')?'USERPROFILE': 'HOME'];
}

String.prototype.startWith = function(char){
  return this.charAt(0) === char;
}
function normalizeAppPath(app){
  if(app.path.startWith('/') ){
    return true;
  }
  else if(app.path.startWith('~')){
    app.path = path.join( getHome(), app.path.substr(2) );
    return true
  }
  else{
    return false
  }
}

// stageNumber:
//    0: folder not setup yet  -> create and clone
//    1: folder done, app not running   -> pull, start
//    2: folder done, app running  -> pull, restart
function isDeployed(app, cb){
  var runPath = path.resolve(app.path, 'running');
  var trackFolder = path.resolve(app.path, 'track')

  var runEx = fs.existsSync(runPath);
  var trackEx = fs.existsSync(trackFolder);

  if( !runEx || !trackEx ){
    return 0;
  }

  // new: run cmd with spawn sync
  var result = run('pm2', ['jlist']);
  // result is an array: [err, data]
  // check if err
  log('dev', result.status);
  if(result.status !== 0){
    return false;
  }
  var pm2List = JSON.parse(result.stdout.toString());
  // log('dev', typeof pm2List);
  // 检查列表中是否有匹配的运行文件
  pm2List.forEach(function(item){
    if(item.pm2_env.pm_exec_path == path.resolve(runPath, app.main) ){
      return 2;
    }
  });

  return 1;
}

var softlink = {
  create: function(linkName, linkTarget){
    return (run('ln', ['-s', linkName, linkTarget]).status === 0);
  },
  change: function(linkName, linkTarget, callback){
    return (run('ln', ['-sfn', linkName, linkTarget]).status === 0);
  }
}




exports.isDeployed = isDeployed;
exports.normalizeAppPath = normalizeAppPath;

exports.softlink = softlink;