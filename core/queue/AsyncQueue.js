"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("async");
/**
 * Async queue for inmemory messaging system
 */
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue(worker) {
        this.queue = async_1.queue(worker, 1);
    }
    /**
     * Fix any type!
     * @param task
     * @param {Function} callback
     */
    AsyncQueue.prototype.push = function (task, callback) {
        this.queue.push(task, callback);
    };
    return AsyncQueue;
}());
exports.AsyncQueue = AsyncQueue;
