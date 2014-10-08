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
    afterDeploy: []
  }
];


module.exports = config;
