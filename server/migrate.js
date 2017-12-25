#!/usr/bin/env node
require('babel-register')
require('babel-polyfill')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const Sequelize = require('sequelize')
const Umzug = require('umzug')
const models = require('./src/models')

const DB_TYPE = process.env.DB_TYPE
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_TYPE,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: DB_TYPE === 'sqlite' ? 'database.sqlite' : null
})

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      sequelize.constructor,
      function () {
        throw new Error(
          `Migration tried to use old style "done" callback. Please
           upgrade to "umzug" and return a promise instead.`
        )
      }
    ],
    path: './src/migrations',
    pattern: /\.js$/
  },
  logging() {
    console.log.apply(null, arguments)
  }
})

function logUmzugEvent(eventName) {
  return function (name) {
    console.log(`${name} ${eventName}`)
  }
}
umzug.on('migrating', logUmzugEvent('migrating'))
umzug.on('migrated', logUmzugEvent('migrated'))
umzug.on('reverting', logUmzugEvent('reverting'))
umzug.on('reverted', logUmzugEvent('reverted'))

function cmdStatus() {
  const result = {}

  return umzug.executed()
    .then(executed => {
      result.executed = executed
      return umzug.pending()
    }).then(pending => {
      result.pending = pending
      return result
    }).then(({executed, pending}) => {
      executed = executed.map(m => {
        m.name = path.basename(m.file, '.js')
        return m
      })
      pending = pending.map(m => {
        m.name = path.basename(m.file, '.js')
        return m
      })

      const current = executed.length > 0 ?
        executed[0].file :
        '<NO_MIGRATIONS>'
      const status = {
        current,
        executed: executed.map(m => m.file),
        pending: pending.map(m => m.file)
      }

      console.log(JSON.stringify(status, null, 2))

      return {executed, pending}
    })
}

/**
 * Create initial sql for init table migration
 */
function cmdInit() {
  const sqlLines = []
  return models.sequelize.sync({
    force: true,
    logging: message => {
      let line = message.replace('Executing (default): ', '').trim()
      if (line.substr(-1) !== ';') {
        line += ';'
      }
      sqlLines.push(line)
    }
  }).then(() => {
    const sql = sqlLines.join('\n')
    fs.writeFile('./src/migrations/00_initial-tables.sql', sql)
  })
}

function cmdMigrate() {
  return umzug.up()
}

function cmdMigrateNext() {
  return cmdStatus()
    .then(({pending}) => {
      if (pending.length === 0) {
        return Promise.reject(new Error('No pending migrations'))
      }
      const next = pending[0].name
      return umzug.up({to: next})
    })
}

function cmdReset() {
  return umzug.down({to: 0})
}

function cmdResetPrev() {
  return cmdStatus()
    .then(({executed}) => {
      if (executed.length === 0) {
        return Promise.reject(new Error('Already at initial state'))
      }
      const prev = executed[executed.length - 1].name
      return umzug.down({to: prev})
    })
}

function cmdHardReset() {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        console.log(`dropdb ${DB_NAME}`)
        child_process.spawnSync(`dropdb ${DB_NAME}`)
        console.log(`createdb ${DB_NAME} --username ${DB_USER}`)
        child_process.spawnSync(
          `createdb ${DB_NAME} --username ${DB_USER}`
        )
        resolve()
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

const cmd = process.argv[2].trim()
let executedCmd

console.log(`${cmd.toUpperCase()} BEGIN`)
switch (cmd) {
  case 'status':
    executedCmd = cmdStatus()
    break

  case 'init':
    executedCmd = cmdInit()
    break

  case 'up':
  case 'migrate':
    executedCmd = cmdMigrate()
    break

  case 'next':
  case 'migrate-next':
    executedCmd = cmdMigrateNext()
    break

  case 'down':
  case 'reset':
    executedCmd = cmdReset()
    break

  case 'prev':
  case 'reset-prev':
    executedCmd = cmdResetPrev()
    break

  case 'reset-hard':
    executedCmd = cmdHardReset()
    break

  default:
    console.log(`invalid cmd: ${cmd}`)
    process.exit(1)
}

executedCmd
  .then(() => {
    const doneStr = `${cmd.toUpperCase()} DONE`
    console.log(doneStr)
    console.log('='.repeat(doneStr.length))
  })
  .catch(err => {
    const errorStr = `${cmd.toUpperCase()} ERROR`
    console.log(errorStr)
    console.log('='.repeat(errorStr.length))
    console.log(err)
    console.log('='.repeat(errorStr.length))
  })
  .then(() => {
    if (cmd !== 'status' && cmd !== 'reset-hard') {
      return cmdStatus()
    }
    return Promise.resolve()
  })
  .then(() => process.exit(0))
