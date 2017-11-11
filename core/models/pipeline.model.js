import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize) {
  return sequelize.define('Pipeline', {
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
        isInFormat() {
          return true
        }
      }
    }
  })
}

