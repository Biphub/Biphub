import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function defineUser (sequelize: Sequelize.Sequelize, DataTypes) {
  const PodAction = sequelize.define('Action', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    doc_ref: DataTypes.STRING,
    trigger: DataTypes.ENUM('poll', 'invoke', 'incoming_webhook')
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
