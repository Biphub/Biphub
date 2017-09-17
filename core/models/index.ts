import * as R from 'ramda'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'

const sequelize = new Sequelize(null, null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: path.join(__dirname, '/database.sqlite')
})

let db = {}

const files = fs.readdirSync(__dirname)
files
  .filter(function(file) {
    return !R.isEmpty(R.match(/\.model\.js$/g, file))
      && file !== 'index.js'
  })
  .forEach(function(file) {
    console.log('checking file ', file)
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
