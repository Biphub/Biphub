export default {
  development: {
    database: null,
    username: null,
    password: null,
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'database.sqlite',
    options: {
      host: 'localhost',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false
    }
    /* options: {
      storage: ':memory:',
      dialect: 'sqlite',
      logging: false
    } */
  },
  test: {
    username: null,
    password: null,
    database: null,
    dialect: 'sqlite',
    options: {
      storage: ':memory:',
      dialect: 'sqlite'
    }
  },
  production: {
    username: null,
    password: null,
    database: null,
    dialect: 'sqlite',
    options: {
      storage: ':memory:',
      dialect: 'sqlite'
    }
  }
}
