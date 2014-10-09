var logger = require('bragi');
var log = logger.log;

var config = require('./test/test-config');

var base = require('./lib/base');
var setup = require('./lib/setup');
var update = require('./lib/update');
var deployHook = require('./lib/deployHook');
var deploy = require('./lib/deploy');


config.forEach(function(app, i, arr){
  if(app.lastDeploy === false){
    // 如果上次没部署成功, 这次就不再弄了, 解决了问题再重新来一次
    log('err', 'last deploy failed... contact admin asap...');
    return false;
  }
  if(!base.normalizeAppPath(app)){
    app.lastDeploy = false;
    log('err', 'app: "', app.name, '" config error', 'wrong app.path. path should start with / or ~ ');
    return;
  }
  
  var stage = base.isDeployed(app);

  if( stage === false){
    app.lastDeploy = false;
    return false;
  }

  var needToDeloy = false;
  var deloyType = '';

  if( stage === 0){
    log('dev', 'got stage 0, gonna setup and deploy');
    setup(app);

    needToDeloy = true;
    deloyType = 'start';
  }
  else{
    if( stage === 1 ){
      log('dev', 'get stage 1, gonna use pm2 start')

      needToDeloy = true;
      deloyType = 'start';
    }
    // 2
    else{
      log('dev', 'get stage 1, gonna use pm2 restart')
      
      deloyType = 'restart';
      needToDeloy = update(app);
      // pm2ID = 
    }
  }
  
  // pre deploy
  if(needToDeloy){
    var beforeResult = deployHook.before(app);
    if( beforeResult ){
      // 部署, 其实很简单: copy, change 软连接
      if( deploy.deploy( app ) ){
        // 执行重启命令
      }
    }
    // return beforeResult;
  }
});
