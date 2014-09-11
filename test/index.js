var should = require('should');
var logger = require('bragi');
var log = logger.log;
var rmdir = require('rmdir');

var config = require('./test-config');
var testApp = config[0];




var base = require('../lib/base');
var setup = require('../lib/setup');


describe('setup module and some base', function(){
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

  it('should return true after setup)', function(){
    this.timeout(30*1000);
    var r = setup(testApp);
    r.should.be.ok;
    // 此时再检查应该返回1了
    base.isDeployed(testApp).should.be.equal(1);
  });

//  after(function(done){
//    rmdir(testApp.path, function(err){
//      done();
//    });
//  });
});