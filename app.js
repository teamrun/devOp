var logger = require('bragi');
var pm2 = require('pm2');

var log = logger.log;

var config = require('./test/test-config');

var base = require('./lib/base');
var setup = require('./lib/setup');
var update = require('./lib/update');
var deployHook = require('./lib/deployHook');
var deploy = require('./lib/deploy');

if(config.env === 'pro' || process.argv[2] ==='pro'){
  logger.options.groupsEnabled = ['err', 'err-detail', 'warning'];
}

// after pm2.connect, process won't exit.  mocha is special
pm2.connect(function(){
  DeployService();
});


function DeployService(){
  config.apps.forEach(oneApp);
}

function oneApp(app){
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
    deployFailHandler(app);
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
      log('dev', 'get stage 2, gonna use pm2 restart')
      
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
        deploy.reStartApp(app, deloyType, function(err){
          if(err){
            log('err', 'err happend while reStartStart app', deloyType, app);
            log('err-detail', err);
            deployFailHandler(app);
          }
          else{
            deploySucHandler(app);
          }
        });
      }
      else{
        log('err', 'deploy.deploy err, copy file and change softlink...');
        deployFailHandler(app);
      }
    }
    else{
      log('err', 'deployHook.before err');
      deployFailHandler(app);
    }
  }

  app.deployTimer = setTimeout(function(){
    oneApp(app);
  }, app.interval || 10*1000);
}


function deployFailHandler(app){
  app.lastDeploy = false;
  // 邮件通知失败...

  // 禁止下一次部署
  clearTimeout(app.deployTimer);
}

function deploySucHandler(app){
  // 通知成功
  // 备份
}
