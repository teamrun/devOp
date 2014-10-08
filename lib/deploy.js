var path = require('path');
var run = require('child_process').spawnSync;
var logger = require('bragi');
var cpr = require('cpr');

log = logger.log;

var base = require('./base');





function deploy(app){
    var folder = base.getAppFolder(app);

    // ************** 拷贝文件到current **************
    // took 1272ms to copy -r 
    // cpr( folder.track, path.join(folder.current, base.getNiceDate()), callback );

    // took 539ms to copy -r 
    var newAppFolder = path.join(folder.current, base.getNiceDate());
    var r = run('cp', ['-r', folder.track, newAppFolder]);

    if( r.status!=0 ){
        log('err', 'error occured when copy file');
        base.echoRunLog(r);
        return false;
    }

    // ************** 修改软连接 **************

    var cr = base.softlink.change(newAppFolder, folder.running);

    return cr;
}

function backup(){}
function roolback(){}


module.exports = {
    deploy: deploy,
    backup: backup,
    roolback: roolback
};