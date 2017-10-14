
const config = {
  development: {
    database: null,
    username: null,
    password: null,
    /* options: {
      host: 'localhost',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialect: 'sqlite',
      storage: appRoot.resolve('/core/models/database.sqlite'),
      logging: false
    } */
    options: {
      storage: ':memory:',
      dialect: 'sqlite',
      logging: false
    }
  },
  test: {
    username: null,
    password: null,
    database: null,
    options: {
      storage: ':memory:',
      dialect: 'sqlite'
    }
  },
  production: {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    options: {
      'host': '127.0.0.1',
      'dialect': 'mysql'
    }
  }
}

export default config
