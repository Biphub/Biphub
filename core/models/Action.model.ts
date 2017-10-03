import * as Sequelize from 'sequelize'

export interface ActionModel {
  title: string,
  doc_ref: string,
  trigger: string,
  imports: JSON,
  exports: JSON
}

export interface ActionInstance extends Sequelize.Instance<ActionModel> {
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function defineUser (sequelize: Sequelize.Sequelize) {
  const PodAction = sequelize.define('Action', {
    title: Sequelize.STRING,
    /** Description of the action */
    description: Sequelize.STRING,
    /** Reference to action's documentation. Typically an URL. */
    doc_ref: Sequelize.STRING,
    /** Type of trigger */
    trigger: Sequelize.ENUM('webhook', 'invoke', 'poll'),
    /** Inputs required to execute the action. Webhook and poll do not require this */
    imports: Sequelize.JSONB,
    /** Output format after executing the action */
    exports: Sequelize.JSONB
  }, {
    associate (models: any) {
      PodAction.belongsTo(models.Pod)
      // Create Action has Many action import
    }
  })
  return PodAction
}
