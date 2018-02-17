#!/usr/bin/env node
require('babel-register')
require('babel-polyfill')
const R = require('ramda')
const program = require('commander')
const podPao = require('./src/DAO/pod.dao')
const bridge = require('./src/bridge/node2node')

program.version('0.0.1')

program
  .command('install <podName>')
  .alias('i')
  .description('Command to install a pod')
  .action((env, options) => {
    console.log('migrate!!', env, ' ', options)
  })

program
  .command('installAll')
  .alias('ia')
  .description('Command to install all pods in the current directory')
  .action(() => {
    podPao.installPods(null).fork(
      e => {
        console.error('Install all pods failed!', e)
      },
      () => {
        console.info('Install all pods complete!')
      }
    )
  })

program
  .command('invoke <POD_METHOD> [attributes...]')
  .description('Invoke a method of pod')
  .action((env, options) => {
    const [pod, action] = R.split('.', env)
    if (!pod || !action) {
      throw new Error(`Invalid pod or action name!
       Please pass it in like slack.postMessage`)
    }
    // Check if pod name does not start with biphub-pod
    // else prepend it to pod variable
    const xPod = R.test(/^biphub-pod/g, pod) ? pod : `biphub-pod-${pod}`
    // Iterate each options [ test=1, test=2 ], convert it to an object
    const attributes = R.reduce(
      (acc, x) => {
        const [key, value] = R.split('=', x)
        acc[key] = value
        return acc
      },
      {},
      options
    )
    console.log('checking action detail ', pod, action, attributes)
    bridge
      .invokeAction2(xPod, action, attributes)
      .fork(console.error, console.log)
  })

program
  .command('uninstallAll')
  .alias('ua')
  .description('Command to uninstall all installed pods')
  .action(() => {
    podPao.uninstallPods().fork(console.error, console.info)
  })

program.command('*').action(env => {
  console.error(`Command ${env} was not found!`)
})

program.parse(process.argv)
