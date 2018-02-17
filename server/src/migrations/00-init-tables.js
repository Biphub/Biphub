'use strict'
const fs = require('fs')
const path = require('path')
const R = require('ramda')

module.exports = {
  up: queryInterface => {
    // Split sql query by newlines and compose raw sqls
    const getRawQueries = R.compose(
      sql => R.map(x => queryInterface.sequelize.query(x), sql),
      sql => sql.split(/\r?\n/),
    )
    const sql = fs.readFileSync(
      path.join(__dirname, './00_initial-tables.sql'),
      'utf8',
    )
    const rqs = getRawQueries(sql)
    console.log(rqs)
    return Promise.all(rqs)
  },
  down: queryInterface => {
    return queryInterface.dropTable('Pods')
  },
}
