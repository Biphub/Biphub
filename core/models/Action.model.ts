import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize) {
  const PodAction = sequelize.define('Action', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    doc_ref: Sequelize.STRING,
    trigger: Sequelize.ENUM('poll', 'invoke', 'incoming_webhook'),
  })
  PodAction.associate = (models) => {
    PodAction.belongsTo(models.Pod)
    // Create Action has Many action import
    PodAction.hasMany(models.Payload, { as: 'importPayload' })
    // Create Action has Many action export
    PodAction.hasMany(models.Payload, { as: 'exportPayload' })
  }
  return PodAction
}
