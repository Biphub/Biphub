"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var server_1 = require("../../core/server");
describe("#pipeline", function () {
    beforeAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
    });
    it("respond with json", function (done) {
        var app = server_1.start();
        app.listen(app.get('port'), function () {
            var request = supertest(app);
            request
                .get('/pipeline')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.test).toBe('test success');
                done();
            });
        });
    });
    it('creates a pipeline', function (done) {
        var app = server_1.start();
        console.log('checking jasmine timeout ', jasmine.DEFAULT_TIMEOUT_INTERVAL);
        app.listen(app.get('port'), function () {
            var request = supertest(app);
            request
                .post('/pipeline')
                .type('form')
                .send({
                title: 'testing!',
                description: 'testing desc!',
                sequence: {
                    a: 1
                }
            })
                .end(function (err, res) {
                if (err) {
                    console.error('Error while creating a new pipeline');
                    return err;
                }
                console.log('res!! ', res.body);
                done();
            });
        });
    });
});
