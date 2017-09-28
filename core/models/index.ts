import * as R from 'ramda'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import { getConnectionConfig } from '../config/sequelize.config'
import { UserModel, UserInstance } from './User.model'
import { PodModel, PodInstance } from './Pod.model'
import { PayloadModel, PayloadInstance } from "./Payload.model"
import { PodAuthModel, PodAuthInstance } from './PodAuth.model'
import { FieldModel, FieldInstance } from './Field.model'
import { PipelineModel, PipelineInstance } from "./Pipeline.model";

const config = getConnectionConfig(process.env.NODE_ENV)

if (!config) {
  throw new Error('Invalid database config!')
}

interface DbConnection {
  sequelize: Sequelize.Sequelize,
  Sequelize: Sequelize.Sequelize,
  User: Sequelize.Model<UserModel, UserInstance>,
  Pod: Sequelize.Model<PodModel, PodInstance>,
  Payload: Sequelize.Model<PayloadModel, PayloadInstance>,
  PodAuth: Sequelize.Model<PodAuthModel, PodAuthInstance>,
  Field: Sequelize.Model<FieldModel, FieldInstance>,
  Pipeline: Sequelize.Model<PipelineModel, PipelineInstance>
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.options,
)

let db = {}

const files = fs.readdirSync(__dirname)
files
  .filter(function (file) {
    return !R.isEmpty(R.match(/\.model\.js$/g, file))
  })
  .forEach(function (file) {
    console.log('checking file ', file)
    const model = sequelize.import(path.join(__dirname, file))
    db[model['name']] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db['sequelize'] = sequelize
db['Sequelize'] = Sequelize

export default <DbConnection>db
