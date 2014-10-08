var path = require('path');
var run = require('child_process').spawnSync;
var mkdirp = require('mkdirp');
var logger = require('bragi');

log = logger.log;

var base = require('./base');

var UPTODATE_REG = /already up-to-date/i;


function update(app){
  var pullResult = run('git', ['pull'], {cwd: path.resolve(app.path, 'track')});
  if( pullResult.status !== 0 ){
    log('err', 'error when update while pull for app: ', app.name);
    return false;
  }
  // base.echoRunLog(pullResult);
  if( UPTODATE_REG.test(pullResult.stdout.toString()) ){
    log('dev', 'repo already up-to-date');
    return false;
  }
  else{
    log('dev', 'gonna run pre deploy: install, build');

    return true;
  }
}


module.exports = update;