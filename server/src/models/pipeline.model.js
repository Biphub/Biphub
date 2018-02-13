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
    sequence: {
      type: Sequelize.JSONB,
      validate: {
        isInFormat() {
          return true
        }
      }
    },
    nodes: {
      type: Sequelize.JSONB
    },
    edges: {
      type: Sequelize.JSONB
    },
    dataMaps: {
      type: Sequelize.JSONB
    }
  })
}

