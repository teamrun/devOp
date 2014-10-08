// setup:
//   create folder: current, backup
//   clone: to track
//   pre deploy
//   copy
//   create soft link

// 负责新建文件夹, 新建软连接, clone代码,

var path = require('path');
var run = require('child_process').spawnSync;
var mkdirp = require('mkdirp');
var logger = require('bragi');

log = logger.log;

var base = require('./base');



function setup(app){

  var folder = base.getAppFolder(app);


  // 新建文件夹
  var folders = ['track', 'current', 'backup'];
  var softlinks = ['running'];
  
  // 创建文件夹... 
  log('dev', 'creat folders under ', folder.project, ': ' ,folders.join(','))
  folders.forEach(function(f){
      mkdirp.sync( folder[f] );
  });

  // 把软连接也加到foler对象中
  softlinks.forEach(function(s){
    folder[s] = path.resolve( folder.project, s);
  });
  // git clone to 'track' folder
  var cloneResult = run('git', ['clone', app.repo, folder.track]);
  if(cloneResult.status !== 0){
    log('err', 'error in setup while git clone :', app.repo, '  -to- ', folder.track);
    base.echoRunLog(cloneResult, 'err-detail');
    return false;
  }

  // 新建软连接, 暂时指向track目录, 这样也能跑起来
  var createSL = base.softlink.create(folder.track, folder.running);
  // log('dev', folder.running, folder.track);

  if(!createSL.status === 0){
    log('err', 'error in setup while create soft link for:', folder.track);
    log('err', 'app name:', app.name);
    base.echoRunLog(createSL, 'err-detail');
    return false;
  }
  return true;
}

module.exports = setup;