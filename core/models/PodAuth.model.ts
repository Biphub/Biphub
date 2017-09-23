import * as Sequelize from 'sequelize'

export interface PodAuthInstance {
  strategyType: string,
  username: string,
  password: string,
}

export default function (sequelize: Sequelize.Sequelize) {
  const PodAuth = sequelize.define('PodAuth', {
    strategyType: {
      type: Sequelize.ENUM('issuer_token', 'oauth', 'none')
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING
  })
  return PodAuth
}
