var path = require('path'),
    child = require('child_process'),
    fs = require('fs');

var deployConfig = require('./blog.js');

var UPTODATE_REG = /^Already\ up-to-date\./;

var despiteNoChange = Boolean(process.argv[2]);
console.log( despiteNoChange );

// cd gitRepo
// git pull
// npm install
// gulp
// mkdir blog_new_date
// \cp
// ln -sfn

var apps = [];

var blog = {
    gitFoler: '',
    running: '',
    current: '',
    backup: ''
};

function checkProjectUpdate( config, despite ){
    var cd = 'cd '+ config.gitFoler,
        pull = 'git pull';

    execCMD( cd+' && '+pull, function( err, stdout, stdin){
        if( err ){
            console.warn( 'err hanppened while cd && git pull' );
            console.warn( err );
        }
        else{
            if( needToDeplot( stdout ) || despite ){
                console.log( 'gonna deploy...');
                deploy( config );
            }
            else{
                console.log('already up-to-date, no need to deploy.');
            }
        }
    });
}

function deploy( config ){
    var newBlogFolder = 'blog_'+getTime();
    var folerPath = config.current + '/'+newBlogFolder;
    var mkdir = 'mkdir '+ folerPath;
    // var mkdirResult = fs.mkdirSync( folerPath );
    // if( mkdirResult ){
    //     console.warn('err occured when mkdir by node: ');
    //     console.warn( mkdirResult );
    //     return false;
    // }
    // else{
    //     console.log('mkdir suc...');
    // }

    var cd = 'cd '+ config.gitFoler,
        npm = 'npm install',
        gulp = 'gulp',
        cp = '\\cp ' + config.gitFoler + '/* -r ' + folerPath,
        ln = 'ln -sfn '+ folerPath+' ' + config.running;
    var cmd = cd+' && '+npm+' && '+gulp+' && '+mkdir+' && '+cp+' && '+ln;
    console.log( 'gonna exec a serise cmd for deploy: ' + cmd );
    execCMD( cmd, function( err, stdout, stdin ){
    // execCMD( '', function( err, stdout, stdin ){
        if( err ){
                console.warn( 'err hanppened while exec deploy cmd' );
                console.warn( err );
        }
        else{
            restartApp( config );
            mvToBackup( config, newBlogFolder );
        }
    });
}

function restartApp( config ){
    
    var appFile = config.appFile || 'app.js';
    var cmd = 'forever restart ' + config.running + '/' + appFile;
    console.log( 'gonna do this: restart appfile: ' + cmd );
    execCMD( cmd, function( err, stdout, stdin ){
        if( err ){
            console.warn( 'err hanppened while restart app' );
            console.warn( err );
        }
        else{
            console.log('restart suc...');
        }
    });
}

function mvToBackup( config, newBlogFolder ){
    console.log( 'gonna to mv some blog folder to backup...' );
    // var allBlogInCurrent = fs.readdirSync( config.current );
}

function execCMD( cmd, callback ){
    child.exec( cmd, callback );
}
function getTime(){
    var d = new Date();
    return d.getFullYear()+'-'+( d.getMonth()+1 )+'-'+d.getDate()+'_'+d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds();
}

function sucHandler(){
    
}

function needToDeplot( gitOut ){
    return !UPTODATE_REG.test(gitOut);
}




module.exports = function(){
    console.log('auto deploy is working');
    // 只在第一次部署的时候传入"不管有没有更新"的参数, 否则后面的每次也都会强制部署了
    checkProjectUpdate( deployConfig, despiteNoChange );
    setInterval( function(){
        checkProjectUpdate( deployConfig );
    }, deployConfig.timeInterval );
};