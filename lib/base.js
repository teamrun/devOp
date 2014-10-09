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
function isDeployed(app){
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
  // log('dev', result.status);
  if(result.status !== 0){
    return false;
  }

  
  var stdout = result.stdout.toString();
  try{
    var pm2List = JSON.parse(stdout);
    // log('dev', pm2List);
    // 检查列表中是否有匹配的运行文件
    log('dev', app.newestApp);
    pm2List.forEach(function(item){
      log('dev', item.pm2_env.pm_exec_path);
      if(item.pm2_env.pm_exec_path == app.newestApp ){
        return 2;
      }
    });
  }
  catch(err){
    log('err', err);
    return 1;
  }
  return 1;
}

var softlink = {
  create: function(linkTo, linkName){
    return (run('ln', ['-s', linkTo, linkName]).status === 0);
  },
  change: function(linkTo, linkName){
    return (run('ln', ['-sfn', linkTo, linkName]).status === 0);
  }
};


//dev tool:
//    输出run后的output
function echoRunLog(result, logLevel){
  result.output.forEach(function(o, i){
    var content;
    if(o === null || o === undefined){
      content = o;
    }
    else{
      content = o.toString();
    }
    log(logLevel||'dev', i, content );
  })
}

function getAppFolder(app){
  var folder = {};
  folder.project = path.resolve(app.path);
  ['track', 'current', 'backup', 'running'].forEach(function(f, i){
    folder[f] = path.resolve(app.path, f);
  })

  return folder;
}

function getNiceDate(){
  var d = new Date();
  var arr1 = [ d.getFullYear(), d.getMonth()+1, d.getDate() ];
  var arr2 = [d.getHours(), d.getMinutes(), d.getSeconds()];
  return arr1.join('-') +  ' ' + arr2.join(':');
}




exports.isDeployed = isDeployed;
exports.normalizeAppPath = normalizeAppPath;
exports.getAppFolder = getAppFolder;
exports.softlink = softlink;
exports.getNiceDate = getNiceDate;

exports.echoRunLog = echoRunLog;

