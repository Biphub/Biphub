"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../../dist/models");
describe("DAO pipeline", function () {
    beforeAll(function (done) {
        models_1.default.sequelize.sync().then(function () {
            return console.log('Initialised seqeulize in environment', process.env.NODE_ENV);
        });
        done();
    });
    it("create", function () {
        models_1.default.Pipeline.create({
            title: 'test pipeline',
            description: 'test description',
            sequence: { a: 1 }
        }).then(function (pipeline) {
            Expect(pipeline.title).toBe('test pipeline');
            Expect(pipeline.description).toBe('test description');
            Expect(pipeline.sequence).toBe({ a: 1 });
        });
    });
});
