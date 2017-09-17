import * as Sequelize from 'sequelize'

export default function (sequelize: any) {
  return sequelize.define('Post', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
  })
}
