import * as Sequelize from 'sequelize'

export default function (sequelize: any) {
  const Pod = sequelize.define('Pod', {
    name: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize. STRING,
    },
  })
  Pod.associate = (models) => {
    Pod.hasMany(models.PodAction)
    Pod.belongsTo(models.PodAuth)
  }
  return Pod
}
