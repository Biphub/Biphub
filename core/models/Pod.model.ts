import * as Sequelize from 'sequelize'

export interface PodModel {
  name: string,
  type: string,
  description: string,
  url: string,
}

export interface PodInstance extends Sequelize.Instance<PodModel> {
}

export default function (sequelize: Sequelize.Sequelize) {
  const Pod = sequelize.define('Pod', {
    name: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize. STRING
    }
  }, {
    classMethods: {
      associate (models: any) {
        Pod.hasMany(models.Action)
        Pod.belongsTo(models.PodAuth)
      }
    }
  })
  return Pod
}
