import { Sequelize as SequelizeType } from 'sequelize'
import * as Sequelize from 'sequelize'

export interface PipelineModel {
  title: string;
  description: string;
  sequence: any;
  entryApp: string;
  entryType: string;
}

export interface PipelineInstance extends Sequelize.Instance<PipelineModel> {
  dataValues: PipelineModel;
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: SequelizeType):
  Sequelize.Model<PipelineInstance, PipelineModel> {
    return sequelize.define<PipelineInstance, PipelineModel>('Pipelines', {
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      entryApp: Sequelize.STRING,
      entryType: Sequelize.ENUM('webhook', 'poll'),
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
          isInFormat (value) {
            return true
          }
        }
      }
    })
  }

