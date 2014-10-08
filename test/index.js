var should = require('should');
var logger = require('bragi');

//不显示除test组外的所有log
// test: 测试里的log
// err: 错误信息
// test-err: 解决测试err所产出的log
// logger.options.groupsEnabled = [ 'test', 'err', 'test-err' ];
var log = logger.log;
var rmdir = require('rmdir');

var config = require('./test-config');
var testApp = config[0];




var base = require('../lib/base');
var setup = require('../lib/setup');
var update = require('../lib/update');
var deployHook = require('../lib/deployHook');
var deploy = require('../lib/deploy');


describe('inital setup and deploy', function(){
  before(function(done){
    base.normalizeAppPath(testApp);
    rmdir(testApp.path, function(err){
      done();
    });
  });

  it('should return 0 stage when there is no "track" and "running" folder', function(){
    var result = base.isDeployed(testApp);
    result.should.be.equal(0);
  });

  it('should return true after setup', function(){
    this.timeout(30*1000);
    var r = setup(testApp);
    r.should.be.ok;
  });
  it('check deploy after setup should get not 0 ', function(){
    // 此时再检查应该返回1了
    // log('test', base.isDeployed(testApp));
    (base.isDeployed(testApp)).should.be.equal(1);
  });

  // check update after initial should get false
  it('check update after initial should get false', function(){
    update( testApp ).should.be.not.ok;
  });

  // execute before hook and
  it('execute before hook should get true', function(){
    this.timeout(60*1000)
    deployHook.before( testApp ).should.be.ok;
  });

  it('copy whole track folder to current, and change softlink, should get true', function(){
    this.timeout(20*1000);
    deploy.deploy(testApp).should.be.ok;
  });

//  after(function(done){
//    rmdir(testApp.path, function(err){
//      done();
//    });
//  });
});