var path = require('path');
var run = require('child_process').spawnSync;
var logger = require('bragi');

log = logger.log;

var base = require('./base');

var beforeDeploy = function(app){
    // do pre install cmds
    // such as npm install, gulp build
    var beforeCmdArr = app.beforeDeploy;
    var folder = base.getAppFolder(app);

    // 每一个before命令都应该成功
    return beforeCmdArr.every(function(rawCmd){
        var cmdArr = rawCmd.split(' ');
        // run( cmdName, [cmd args ], options );
        var bf = run(cmdArr[0], cmdArr.splice(1), {cwd: folder.track });
        if(bf.status !== 0){
            log('err', 'this cmd did not end well:', rawCmd);
            base.echoRunLog( bf, 'err-detail');
        }
        return (bf.status == 0);
    });
}

var afterDeploy = function(app){

}


module.exports = {
    before: beforeDeploy,
    after: afterDeploy
};