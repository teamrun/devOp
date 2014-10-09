// format

var config = [
  {
    name: 'test for devops',
    // abs path, start with / or ~
    path: '~/Documents/dev/LIB/tt',
    main: 'app.js',
    repo: 'https://github.com/teamrun/test-devops.git',
    args: '--harmony',
    beforeDeploy: ['npm install', 'gulp'],
    start: 'pm2 start app.js',
    restart: 'pm2 restart app.js',
    afterDeploy: []
  }
];


module.exports = config;
