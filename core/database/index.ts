import sequelize from './sequelize'

/**
 * Each database must support
 * connect -> establishes connection to the database and returns connection context
 * defineModels -> defines all required models to the database. Depending on the database, this step maybe skipped.
 */
export default {
  connect: sequelize.connect,
  defineModels: sequelize.defineModels,
}
