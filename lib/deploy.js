var path = require('path');
var run = require('child_process').spawnSync;
var pm2 = require('pm2');
var logger = require('bragi');
var cpr = require('cpr');

log = logger.log;

// pm2.connect(function(){});

var base = require('./base');


// pm2.connect(function(){


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

// start or restart app...
function reStartApp(app, restartCmd, cb){
    var folder = base.getAppFolder(app);
    var appPath = path.join(folder.running, app.appFile);
    if(restartCmd === 'start'){
        pm2.start( appPath, cb);
    }
    else if(restartCmd === 'restart'){
        getPm2Id(appPath, function(err, id){
            if(err){
                log('err', 'get pm2 id error');
                log('err-detail', err);
                cb(err);
            }
            else{
                pm2.restart(id, function(err, proc){
                    cb(null);
                });
            }
        });
    }

    


    // var cmdArr = app[restartCmd].split(' ');
    // var r = run(cmdArr[0], cmdArr.slice(1), {cwd: folder.running});
    // log('dev', cmdArr[0], cmdArr.slice(1), {cwd: folder.running});
    // if( r.status!=0 ){
    //     log('err', 'error occured when copy file');
    //     base.echoRunLog(r);
    //     return false;
    // }
    // else{
    //     return true;
    // }
}

function getPm2Id( appPath, cb ){
    pm2.list(function(err, list){
        if(err){
            cb(err);
        }
        else{
            var pm2Id = null;
            list.forEach(function(p, i){
                if(p.pm2_env.pm_exec_path === appPath){
                    // log('dev', p);
                    // log('dev', p.pm2_env.pm_id);
                    pm2Id = p.pm2_env.pm_id;
                }
            });
            cb(err, pm2Id);
        }
    });
}

function backup(){}
function roolback(){}


module.exports = {
    deploy: deploy,
    reStartApp: reStartApp,
    backup: backup,
    roolback: roolback
};