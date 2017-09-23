"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appRoot = require("app-root-path");
/**
 * Dependent on process.env.NODE_ENV
 * get sequelize
 */
var getConnectionConfig = function (NODE_ENV) {
    if (NODE_ENV === 'development') {
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
                storage: appRoot.resolve('/core/models/database.sqlite')
            }
        };
    }
    else if (NODE_ENV === 'test') {
        return {
            username: null,
            password: null,
            database: null,
            options: {
                storage: ':memory',
                dialect: 'sqlite'
            }
        };
    }
    else if (NODE_ENV === 'production') {
        return {
            'username': 'root',
            'password': null,
            'database': 'database_production',
            options: {
                'host': '127.0.0.1',
                'dialect': 'mysql'
            }
        };
    }
    return null;
};
exports.getConnectionConfig = getConnectionConfig;
/**
 * Getting options required for syncing
 * @returns {any}
 */
var getSyncOptions = function () {
    if (process.env.NODE_ENV === 'development') {
        return { sync: true };
    }
    else if (process.env.NODE_ENV === 'test') {
        return { sync: true };
    }
    return { sync: false };
};
exports.getSyncOptions = getSyncOptions;
