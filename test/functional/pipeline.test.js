"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var server_1 = require("../../core/server");
describe("#pipeline", function () {
    beforeAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
    });
    it("respond with json", function (done) {
        server_1.start().fork(function (e) { return console.error(e); }, function (app) {
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
    });
    it('creates a pipeline', function (done) {
        server_1.start().fork(function (e) {
            throw e;
        }, function (app) {
            app.listen(app.get('port'), function () {
                var request = supertest(app);
                console.log('checking app ', app);
                request.post('/pipeline').type('form')
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
});
