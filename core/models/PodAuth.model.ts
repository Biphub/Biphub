import * as Sequelize from 'sequelize';
import * as models from './index';

export default function (sequelize) {
  const PodAuth = sequelize.define('PodAuth', {
    strategyType: {
      type: Sequelize.ENUM('issuer_token', 'oauth', 'none'),
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
  })
  return PodAuth
}
