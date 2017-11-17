'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface
    return Promise.all([
      // Pod hasMany Actions
      sequelize.query('ALTER TABLE Actions ADD podId INTEGER; ADD FOREIGN KEY podId REFERENCES Pods(id);')
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Pods')
  }
}