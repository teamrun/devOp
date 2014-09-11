var run = require('child_process').spawnSync;

var git = {
    clone: function(repo, config, callback){
      run('git', 'clone ' + repo, config, callback);
    },
    pull: function(repo, config, callback){
      run('git', 'pull ' + repo, config, callback);
    }
};


module.exports = git;