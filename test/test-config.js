// format

var config = {};
config.env = 'dev';

config.apps= [
  {
    name: 'test for devops',
    // abs path, start with / or ~
    path: '~/Documents/dev/LIB/tt',
    main: 'app.js',
    repo: 'https://github.com/teamrun/test-devops.git',
    args: '--harmony',
    beforeDeploy: ['cnpm install', 'gulp'],
    appFile: 'app.js',
    afterDeploy: []
  }
];


module.exports = config;
