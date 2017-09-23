import { Sequelize as SequelizeType } from 'sequelize'
import * as Sequelize from 'sequelize'

export interface PipelineModel {
  title: string,
  sequence: JSON
}

export interface PipelineInstance extends Sequelize.Instance<PipelineModel> {
  dataValues: PipelineModel
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: SequelizeType) {
  const Piepline = sequelize.define('Piepline', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    /**
     * {
     *   action1(trigger) {
     *      graph {
     *        x
     *        y
     *      }
     *      options {}
     *      action2 {
     *         graph {
     *           x
     *           y
     *         }
     *         options {}
     *         action3 {
     *           ...
     *         }
     *      }
     *      action4 {
     *        graph {
     *          x
     *          y
     *        }
     *        action 5{
     *           ...
     *           action6 {
     *
     *           }
     *           action7 {
     *
     *           }
     *        }
     *      }
     *   }
     * }
     */
    sequence: {
      type: Sequelize.JSONB,
      validate: {
        isInFormat(value) {
          console.log('checking value ', value)
          return true
        }
      }
    }
  })
  return Piepline
}
