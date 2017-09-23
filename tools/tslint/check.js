const exec = require('child_process').exec

console.log('checking ! ')

exec('npm run tslint', (err, stdout) => {
  console.log(stdout);
})
