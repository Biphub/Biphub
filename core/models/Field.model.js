"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
function default_1(sequelize) {
    var Field = sequelize.define('Field', {
        title: Sequelize.STRING,
        properties: Sequelize.JSONB
    }, {
        classMethods: {
            associate: function (models) {
                Field.belongsTo(models.Payload);
            }
        }
    });
    return Field;
}
exports.default = default_1;
