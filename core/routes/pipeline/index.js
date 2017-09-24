"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var pipeline_dao_1 = require("../../DAO/pipeline.dao");
exports.default = function () {
    var api = express_1.Router();
    // Get a pipeline
    api.get('/pipeline', function (req, res) {
        res.json({ test: 'test success' });
    });
    // Create a pipeline
    api.post('/pipeline', function (req, res) {
        req.checkBody({
            title: {
                notEmpty: true
            },
            description: {
                notEmpty: true,
            },
            sequence: {
                notEmpty: true,
            }
        });
        var _a = req.body, title = _a.title, description = _a.description, sequence = _a.sequence;
        console.log('checking title decription sequence ', title, description, sequence);
        pipeline_dao_1.create({ title: title, description: description, sequence: sequence })
            .fork(function (e) {
            console.error('failed to create a pipeline ', e);
            throw e;
        }, function (pipeline) {
            console.log('created pipe! ', pipeline);
            return res.json({
                test: 1
            }).end();
        });
    });
    return api;
};
