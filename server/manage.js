#!/usr/bin/env node
const program = require('commander')

program.version('0.0.1')

program
  .command('install <podName>')
  .alias('i')
  .description('Command to install a pod')
  .action(function(env, options) {
    console.log('migrate!!', env, ' ', options)
  })

program
  .command('installAll')
  .alias('all')
  .description('Command to install all pods in the current directory')
  .action(function(env, options) {
    console.log('migrate!!', env, ' ', options)
  })

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env)
  })

program.parse(process.argv)