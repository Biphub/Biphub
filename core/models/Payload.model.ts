import * as Sequelize from 'sequelize'

export interface PayloadModel {
  title: string
}

export interface PayloadInstance extends Sequelize.Instance<PayloadModel> {
  dataValues: PayloadModel
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: Sequelize.Sequelize):
  Sequelize.Model<PayloadInstance, PayloadModel> {
  let Payload = sequelize.define<PayloadInstance, PayloadModel>('Payload', {
    title: Sequelize.STRING
  })
  Payload.associate = (models: any) => {
    Payload.belongsTo(models.Action)
  }
  return Payload
}
