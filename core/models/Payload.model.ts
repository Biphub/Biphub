import { Sequelize as Type } from 'sequelize'
import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: Type) {
  let Payload = sequelize.define('Payload', {
    title: Sequelize.STRING
  })
  Payload.associate = (models: any) => {
    Payload.belongsTo(models.Action)
  }
  return Payload
}
