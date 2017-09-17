import R from 'ramda'
import * as fantasy from 'ramda-fantasy'
import * as path from 'path'
import { default as Sequelize } from 'sequelize'

const Future = fantasy.Future

const connect = () => {
  return new Future((rej: Function, res: Function) => {
    console.log('checking db path ', path.join(__dirname, '/database.sqlite'))
    const sequelize = new Sequelize(null, null, null, {
      host: 'localhost',
      dialect: 'sqlite',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },

      // SQLite only
      storage: path.join(__dirname, '/database.sqlite')
    });
    // Below line make sure sequelize is correctly connected
    sequelize
      .authenticate()
      .then(() => {
        console.info('Successfully establishes database connection using Sequelize!')
        return res(sequelize)
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
        rej(err)
      })
  })
}

export default connect
