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

//不显示除test组外的所有log
logger.options.groupsEnabled = [ 'test' ];
log = logger.log;

var base = require('./base');

function setup(app){
  // 新建文件夹
  var folders = ['track', 'current', 'backup'];
  log('dev', 'creat folders under ', path.resolve(app.path), ': ' ,folders.join(','))
  folders.forEach(function(f){
      mkdirp.sync(path.resolve(app.path, f));
  });
  // git clone to track
  var cloneResult = run('git', ['clone', app.repo, path.resolve(app.path, 'track')]);
  if(cloneResult.status !== 0){
    log('err', 'error in setup while git clone :', app.repo, '  -to- ', path.resolve(app.path, 'track'));
    return false;
  }

  // 新建软连接, 暂时指向track目录, 这样也能跑起来
  var createSL = base.softlink.create(path.resolve(app.path, 'track'), path.resolve(app.path,'running'))
//  log('dev', path.resolve(app.path,'running'), path.resolve(app.path, 'track'));

  if(!createSL.status === 0){
    log('err', 'error in setup while create soft link for:',  path.resolve(app.path, 'track'));
    log('err', 'app name:', app.name);
    return false;
  }
  return true;
}

module.exports = setup;