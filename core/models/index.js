import R from 'ramda'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
const getSeqConfig = (file) => R.compose(
  JSON.parse,
  x => fs.readFileSync(`core/config/${x}`, 'utf8')
)(file)
// Fix any config type
const seqConfig = R.memoize(getSeqConfig)('sequelize.config.json')
const config = R.propOr(null, process.env.NODE_ENV, seqConfig)

if (!config) {
  throw new Error('Invalid database config!')
}

class Database {
  constructor () {
    this._models = null
    this._sequelize = null
    const options = {
      dialect: config.dialect,
      storage: config.storage,
      logging: config.logging
    }
    this._sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      options
    )

    this._models = {}

    const files = fs.readdirSync(__dirname)
    files
      .filter((file) => {
        return !R.isEmpty(R.match(/\.model\.js$/g, file))
      })
      .forEach((file) => {
        const model = this._sequelize.import(path.join(__dirname, file))
        this._models[model['name']] = model
      })

    // invoke associations on each of the models
    Object.keys(this._models).forEach((modelName) => {
      if (this._models[modelName].options.hasOwnProperty('associate')) {
        this._models[modelName].options.associate(this._models)
      }
    })
  }
  getModels = () => this._models
  getSequelize = () => this._sequelize
}

const database = new Database()
export const models = database.getModels()
export const sequelize = database.getSequelize()

export default {
  models,
  sequelize
}
