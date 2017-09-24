"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var setup = function () {
    dotenv.config({ path: path.join(__dirname, '/../../.env') });
    console.log('Env setup complete', process.env.NODE_ENV);
    return dotenv;
};
exports.default = {
    setup: setup
};
