"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var models_1 = require("../../../core/models");
var podDao = require("../../../core/DAO/pod.dao");
describe("#PodDao test", function () {
    beforeEach(function (done) {
        models_1.default.sequelize.sync({ force: true }).then(function () {
            console.log('Initialised seqeulize in environment', process.env.NODE_ENV);
            done();
        });
    });
    it('install all pods', function () {
        podDao.installPods()
            .fork(function (err) { return console.error(err); }, function (pods) {
            expect(R.isEmpty(pods)).toBe(false);
        });
    });
    it('each pod should contain title, desc, name, id, url, updatedAt, createdAt', function () {
        podDao.installPods()
            .fork(function (err) { return console.error(err); }, function (pods) {
            var plainPods = R.map(function (pod) { return pod.values; }, pods);
            R.forEach(function (pod) {
                expect(R.isEmpty(pod.title)).toBe(false);
                expect(R.isEmpty(pod.id)).toBe(false);
                expect(R.isEmpty(pod.description)).toBe(false);
                expect(R.isEmpty(pod.url)).toBe(false);
                expect(R.isEmpty(pod.updatedAt)).toBe(false);
                expect(R.isEmpty(pod.createdAt)).toBe(false);
            }, plainPods);
        });
    });
});
