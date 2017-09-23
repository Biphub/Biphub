"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
/**
 * Pods' action such as onNewMessage, sendMessage, postTwit, and etc
 * @param sequelize
 * @returns {any}
 */
function default_1(sequelize) {
    var Piepline = sequelize.define('Pipeline', {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        /**
         * {
         *   action1(trigger) {
         *      graph {
         *        x
         *        y
         *      }
         *      options {}
         *      action2 {
         *         graph {
         *           x
         *           y
         *         }
         *         options {}
         *         action3 {
         *           ...
         *         }
         *      }
         *      action4 {
         *        graph {
         *          x
         *          y
         *        }
         *        action 5{
         *           ...
         *           action6 {
         *
         *           }
         *           action7 {
         *
         *           }
         *        }
         *      }
         *   }
         * }
         */
        sequence: {
            type: Sequelize.JSONB,
            validate: {
                isInFormat: function (value) {
                    console.log('checking value ', value);
                    return true;
                }
            }
        }
    });
    return Piepline;
}
exports.default = default_1;
