"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncQueue_1 = require("./AsyncQueue");
/**
 * Dependent env variable: MESSAGE_QUEUE. It can be either memory | rabbit
 */
exports.createQueue = function (worker) {
    console.log('checking message queue ', process.env.MESSAGE_QUEUE, '  pr ', process.env.DATABASE_TYPE);
    if (process.env.MESSAGE_QUEUE === 'memory') {
        return new AsyncQueue_1.AsyncQueue(worker);
    }
    return null;
};
