const exec = require('child_process').exec

exec('sequelize db:migrate', (error, stdout, stderr) => {
  if (error || stderr) {
    console.error(error)
    console.error(stderr)
  }
  if (stdout) {
    console.log(stdout)
  }
})
