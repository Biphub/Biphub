import * as path from 'path';
import * as appRoot from 'app-root-path'

/**
 * Dependent on process.env.NODE_ENV
 * get sequelize
 */
const getConnectionConfig = ():
  {
    database: string | null,
    username: string | null,
    password: string | null,
    options: {} | null
  } => {
  if (process.env.NODE_ENV === 'development') {
    return {
      database: null,
      username: null,
      password: null,
      options: {
        host: 'localhost',
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        dialect: 'sqlite',
        // SQLite only
        storage: appRoot.resolve('/core/models/database.sqlite'),
      }
    }
  } else if (process.env.NODE_ENV === 'test') {
    return {
      username: 'root',
      password: null,
      database: 'database_test',
      options: {
        host: '127.0.0.1',
        dialect: 'mysql'
      }
    }
  } else if (process.env.NODE_ENV === 'production') {
    return {
      'username': 'root',
      'password': null,
      'database': 'database_production',
      options: {
        'host': '127.0.0.1',
        'dialect': 'mysql'
      }
    }
  }
  return null;
}

/**
 * Getting options required for syncing
 * @returns {any}
 */
const getSyncOptions = () : {
  sync: boolean
} => {
  if (process.env.NODE_ENV === 'development') {
    return { sync: true }
  } else if (process.env.NODE_ENV === 'test') {
    return { sync: true }
  }
  return { sync: false }
}

export {
  getConnectionConfig,
  getSyncOptions,
}
