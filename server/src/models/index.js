import R from 'ramda'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

class Database {
  constructor () {
    this._models = null
    this._sequelize = null
    console.log('checking envs ', process.env.DB_NAME, ' ', process.env.DB_USER, ' ', process.env.DB_PASS)
    console.log(process.env.DB_TYPE, ' ', process.env.DB_HOST)
    this._sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        storage: process.env.DB_TYPE === 'sqlite' ? 'database.sqlite' : null
      }
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
