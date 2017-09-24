"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../../core/models");
var pipelineDao = require("../../../core/DAO/pipeline.dao");
describe("DAO pipeline", function () {
    beforeAll(function (done) {
        models_1.default.sequelize.sync({ force: true }).then(function () {
            return console.log('Initialised seqeulize in environment', process.env.NODE_ENV);
        });
        done();
    });
    it('create', function () {
        pipelineDao.create({
            title: 'test pipeline',
            description: 'test description',
            sequence: { a: 1 }
        }).fork(function (pipeline) {
            expect(pipeline.title).toBe('test pipeline');
            expect(pipeline.description).toBe('test description');
            expect(pipeline.sequence).toBe({ a: 1 });
        }, function (e) {
            fail(e);
        });
    });
    it('findAll', function () {
    });
});
