var fs = require('fs');
var path = require('path');
var run = require('child_process').spawnSync;
var logger = require('bragi');
var log = logger.log;

var config = require('./test/test-config')

var base = require('./lib/base');
var setup = require('./lib/setup');
var update = require('./lib/update');


// 使config中的路径


config.forEach(function(app, i, arr){
  if(app.lastDeploy === false){
    // 如果上次没部署成功, 这次就不再弄了, 解决了问题再重新来一次
    return;
  }
  if(!base.normalizeAppPath(app)){
    app.lastDeploy = false;
    log('err', 'app: "', app.name, '" config error', 'wrong app.path. path should start with / or ~ ');
    return;
  }
  // 闭包
  var stage = base.isDeployed(app);

  var startCmd = 'start';
  if( stage === false){
    app.lastDeploy = false;
    return false;
  }
  if( stage === 0){
    log('dev', 'got stage 0, gonna setup and deploy');
    setup(app);
  }
  else if( stage === 1 ){
    log('dev', 'get stage 1, gonna use pm2 start')
    // startCmd
  }
  // 2
  else{
    log('dev', 'get stage 1, gonna use pm2 restart')
    startCmd = 'restart';
    // pm2ID = 
  }
  // update
});
