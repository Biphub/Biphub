"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelize_config_1 = require("../config/sequelize.config");
var config = sequelize_config_1.getConnectionConfig(process.env.NODE_ENV);
if (!config) {
    throw new Error('Invalid database config!');
}
var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
var db = {};
var files = fs.readdirSync(__dirname);
files
    .filter(function (file) {
    return !R.isEmpty(R.match(/\.model\.js$/g, file));
})
    .forEach(function (file) {
    console.log('checking file ', file);
    var model = sequelize.import(path.join(__dirname, file));
    db[model['name']] = model;
});
Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});
db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;
exports.default = db;
