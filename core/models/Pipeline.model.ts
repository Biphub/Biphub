import { Sequelize as SequelizeType } from 'sequelize'
import * as Sequelize from 'sequelize'

export interface PipelineModel {
  title: string
}

/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
export default function (sequelize: SequelizeType) {
  const Piepline = sequelize.define('Piepline', {
    title: Sequelize.STRING
  })
  return Piepline
}
