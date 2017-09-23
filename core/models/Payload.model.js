"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
function default_1(sequelize) {
    var Payload = sequelize.define('Payload', {
        title: Sequelize.STRING
    });
    Payload.associate = function (models) {
        Payload.belongsTo(models.Action);
        Payload.hasMany(models.Field);
    };
    return Payload;
}
exports.default = default_1;
