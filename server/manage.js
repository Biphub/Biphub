#!/usr/bin/env node
require('babel-register')
require('babel-polyfill')
const program = require('commander')
const podPao = require('./src/DAO/pod.dao')

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
  .alias('ia')
  .description('Command to install all pods in the current directory')
  .action(function(env, options) {
    podPao.installPods(null).fork(
      (e) => {
        console.error('Install all pods failed!', e)
      },
      () => {
        console.info('Install all pods complete!')
      }
    )
  })

program
  .command('uninstallAll')
  .alias('ua')
  .description('Command to uninstall all installed pods')
  .action(function(env, options) {
    podPao.uninstallPods().fork(
      console.error,
      console.info
    )
  })

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env)
  })

program.parse(process.argv)