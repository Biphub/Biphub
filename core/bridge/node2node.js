"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * General utilities required for node pods to node hub integration
 */
var R = require("ramda");
var appRoot = require("app-root-path");
var fs = require("fs");
/**
 * Using commonjs require all pods' details
 * During development and testing, it will only require pods
 * inside pods/staging/ folder
 */
exports.getAllManifests = function () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        var stagingPodsFolder_1 = appRoot.resolve('/pods/staging');
        var pods = fs.readdirSync(stagingPodsFolder_1);
        var getManifests = R.compose(R.tap(console.log), R.filter(function (x) { return x; }), R.map(R.tryCatch(JSON.parse, R.F)), R.map(function (man) { return fs.readFileSync(man, 'utf8'); }), R.map(function (pod) { return stagingPodsFolder_1 + "/" + pod + "/manifest.json"; }));
        return getManifests(pods);
    }
};
