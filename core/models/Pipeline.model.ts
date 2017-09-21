import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: any) {
  const Piepline = sequelize.define('Piepline', {
    title: Sequelize.STRING,
  })
  return Piepline
}
