import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function defineUser (sequelize: Sequelize.Sequelize) {
  const PodAction = sequelize.define('Action', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    doc_ref: Sequelize.STRING,
    trigger: Sequelize.STRING
  }, {
    classMethods: {
      associate(models: any) {
        PodAction.belongsTo(models.Pod)
        // Create Action has Many action import
        PodAction.hasMany(models.Payload)
        // Create Action has Many action export
        // PodAction.hasMany(models.Payload, { as: 'exportPayload' })
      }
    }
  })
  return PodAction
}
