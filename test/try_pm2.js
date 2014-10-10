var pm2 = require('pm2');

pm2.connect(function(){
    console.log('oh yeah, i won\' exist process');
});