import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: any) {
  const PodAction = sequelize.define('PodActionImport', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    doc_ref: Sequelize.STRING,
    trigger: Sequelize.ENUM('poll', 'invoke', 'incoming_webhook'),
  })
  PodAction.associate = (models) => {
    PodAction.belongsTo(models.Pod)
  }
  return PodAction
}
