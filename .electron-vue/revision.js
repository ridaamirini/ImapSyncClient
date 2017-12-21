let fs = require('fs')
let git = require('git-rev-sync')
let app = require('../package.json')

let revision = {
  rev: git.short(),
  version: app.version + '.' + git.short(),
  date: (new Date()).toLocaleString()
};

fs.writeFileSync('revision.json', JSON.stringify(revision, null, 2));

console.log(revision.version);