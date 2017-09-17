import * as R from 'ramda'
import * as fantasy from 'ramda-fantasy'
import { default as Post } from '../../models/Post.model'
import { default as User } from '../../models/User.model'

const Future = fantasy.Future

const models = [
  Post,
  User
]

/**
 * Future define single model into current database context.
 * It is currently designed to support sequelize
 * @param sequelize
 * @param model  -> JSON representation of
 */
const defineModel = ({ sequelize, model }: { sequelize: any, model: any }) => {
  return new Future((rej: Function, res: Function) => {
    try {
      model(sequelize).sync({ force: true }).then(() => {
        return res()
      })
    } catch (e) {
      console.error('Define model failed due to ', e)
      return rej(e)
    }
  })
}

/**
 * Using current connection type, define all required models
 * @param sequelize
 */
const setupModels = (sequelize: any) => {
  return new Future((rej: Function, res: Function) => {
    const defineModelProps = R.map((model) => ({ sequelize, model }), models)
    const traverable = R.traverse(Future.of, defineModel, defineModelProps)
    traverable.fork(
      (err: any) => {
        console.error('Setup models failed! ', err)
        rej(err)
      },
      () => {
        console.info('Successfully defined all models')
        // Passing current sequelize context for next usage
        res(sequelize)
      }
    )
  })

}

export default setupModels
