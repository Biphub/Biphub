import * as R from 'ramda'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
import { UserModel, UserInstance } from './User.model'
import { PodModel, PodInstance } from './Pod.model'
import { ActionModel, ActionInstance } from './Action.model'
import { PodAuthModel, PodAuthInstance } from './PodAuth.model'
import { FieldModel, FieldInstance } from './Field.model'
import { PipelineModel, PipelineInstance } from './Pipeline.model'
const getSeqConfig = (file: string) => R.compose(
  JSON.parse,
  x => fs.readFileSync(`core/config/${x}`, 'utf8')
)(file)
// Fix any config type
const seqConfig = R.memoize(getSeqConfig)('sequelize.config.json')
const config = R.propOr(null, process.env.NODE_ENV, seqConfig) as any

if (!config) {
  throw new Error('Invalid database config!')
}

interface SequelizeModels {
  User: Sequelize.Model<UserModel, UserInstance>,
  Pod: Sequelize.Model<PodModel, PodInstance>,
  Action: Sequelize.Model<ActionModel, ActionInstance>,
  PodAuth: Sequelize.Model<PodAuthModel, PodAuthInstance>,
  Field: Sequelize.Model<FieldModel, FieldInstance>,
  Pipeline: Sequelize.Model<PipelineModel, PipelineInstance>;
  [key: string]: any;
}

class Database {
  private _models: SequelizeModels;
  private _sequelize: Sequelize.Sequelize;

  constructor () {
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

    this._models = ({} as any)

    const files = fs.readdirSync(__dirname)
    files
      .filter((file) => {
        return !R.isEmpty(R.match(/\.model\.js$/g, file))
      })
      .forEach((file) => {
        const model = this._sequelize.import(path.join(__dirname, file))
        this._models[(model as any)['name']] = model
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
