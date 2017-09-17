import * as path from 'path'

export default {
  "development": {
    "username": null,
    "password": null,
    "database": null,
    // SQLite only
    storage: path.join(__dirname, '../databas/sequelize/database.sqlite'),
    'use_env_variable': false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
}
