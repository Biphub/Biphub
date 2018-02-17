import * as Sequelize from 'sequelize'

export default function(sequelize) {
  const PodAuth = sequelize.define(
    'PodAuth',
    {
      strategyType: {
        type: Sequelize.ENUM('issuer_token', 'oauth', 'none'),
      },
      properties: Sequelize.JSONB,
    },
    {
      associate(models) {
        PodAuth.belongsTo(models.Pod)
      },
    },
    {
      associate(models) {
        PodAuth.belongsTo(models.Pod, { onDelete: 'cascade', hooks: true })
        // Create Action has Many action import
      },
    },
  )
  return PodAuth
}
