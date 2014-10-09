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


base.normalizeAppPath(testApp);

// describe.skip('inital setup and deploy: ', function(){
describe('inital setup and deploy: ', function(){
  before(function(done){
    ;
    rmdir(testApp.path, function(err){
      done();
    });
  });

  it('should return 0 stage when there is no "track" and "running" folder', function(){
    var result = base.isDeployed(testApp);
    result.should.be.equal(0);
  });

  it('should return true after setup', function(){
    this.timeout(60*1000);
    var r = setup(testApp);
    r.should.be.ok;
  });
  it('check deploy after setup should get not 0 ', function(){
    // 此时再检查应该返回1了
    // log('test', base.isDeployed(testApp));
    (base.isDeployed(testApp)).should.be.equal(1);
  });

  // check update after initial should get false
  it('check update after setup should get false', function(){
    this.timeout(60*1000)
    var updateResult = update( testApp );
    log('test', updateResult);
    updateResult.should.be.not.ok;
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

  it('after deploy, should be able to start app at folder.running', function(){
    this.timeout(10*1000);
    deploy.reStartApp(testApp, 'start').should.be.ok;
  });
});


describe('检测到正在运行, 更新 -> 重启部署', function(){
  it('应该检测到正在运行', function(){
    var r = base.isDeployed(testApp);
    r.should.be.equal(2);
  });
});