"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
function default_1(sequelize) {
    var PodAuth = sequelize.define('PodAuth', {
        strategyType: {
            type: Sequelize.ENUM('issuer_token', 'oauth', 'none')
        },
        username: Sequelize.STRING,
        password: Sequelize.STRING
    });
    return PodAuth;
}
exports.default = default_1;
