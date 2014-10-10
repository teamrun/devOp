# operation modules for my site

## features
* auto deploy: `git pull` to check updates on master branch and auto `npm install && gulp` and a serise cmd to deploy these new codes
* mail notification: send rich text email to notify people who is concern about this


## need
nodejs version > 0.11 cause used child_process.spawnSync



## requirement:
* pm2: powerfull deops tool, much better than forever
* nodejs v0.11.14: spawnSync supported and supported rightly