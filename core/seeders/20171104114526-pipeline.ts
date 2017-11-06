'use strict';
import { default as models } from '../models'
import { QueryInterface, Sequelize } from 'sequelize'

module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(
      'Pipelines',
      [{
        title: 'test pipeline',
        description: 'this is just for testing!',
        entryApp: 'biphub-pod-fake1',
        entryType: 'webhook',
        sequence: JSON.stringify({
          'webhook': {
            podName: 'biphub-pod-fake1',
            graph: {
              x: 10,
              y: 210
            },
            next: {
              'post-fake-message': {
                podName: 'biphub-pod-fake1',
                graph: {
                  x: 20,
                  y: 50
                },
                next: {
                  'create-fake-issue': {
                    podName: 'biphub-pod-fake2',
                    graph: {
                      x: 40,
                      y: 10
                    }
                  }
                }
              },
              'test-move-issue': {
                podName: 'biphub-pod-fake2',
                graph: {
                  x: 10,
                  y: 60
                },
                next: {
                  'search-channel': {
                    podName: 'biphub-pod-fake1',
                    graph: {
                      z: 10,
                      x: 20
                    }
                  }
                }
              },
              'deleteFakeMessage': {
                podName: 'biphub-pod-fake1',
                graph: 1
              }
            }
          }
        })
      }]
    ).catch(function (err) {
      console.error(err.message);
      throw err;
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
