import * as Sequelize from 'sequelize'

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: any) {
  const PodAction = sequelize.define('ActionImport', {
    title: Sequelize.STRING,
    properties: Sequelize.JSONB,
  })
  PodAction.associate = (models: any) => {
    PodAction.belongsTo(models.Pod)
  }
  return PodAction
}
