var config = {
    blog: {
        gitRepo: '',
        cmd: {
            build: 'gulp',
            run: 'pm2 app.js'
        },
        path: ''
    },
    vc: {
        gitRepo: '',
        cmd: {
            build: 'gulp',
            run: 'node app.js'
        },
        path: ''
    },
    devops: {
        gitRepo: '',
        cmd: {
            build: '',
            run: 'node app.js',
            start: 'pm2 app.js',
            restart: ''
        }
    }
};

// will create these folder / soft-link under path
// track
// backup
// current
// running