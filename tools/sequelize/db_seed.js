const exec = require('child_process').exec

exec('cross-env NODE_ENV=development sequelize db:seed:all', (error, stdout, stderr) => {
  if (error || stderr) {
    console.error(error)
    console.error(stderr)
  }
  if (stdout) {
    console.log(stdout)
  }
})
