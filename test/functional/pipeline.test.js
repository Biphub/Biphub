"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var server_1 = require("../../core/server");
describe("#pipeline", function () {
    it("respond with json", function (done) {
        server_1.start().fork(function (e) { return console.error(e); }, function (app) {
            var server = app.listen(app.get('port'), function () {
                var request = supertest(app);
                request
                    .get('/pipeline')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log('checking body ', res.body.test);
                    expect(res.body.test).toBe('test success');
                    server.close(function () {
                        console.log('closing the server!!');
                        done();
                    });
                });
            });
        });
    });
    it('creates a pipeline', function (done) {
        server_1.start().fork(function (e) {
            throw e;
        }, function (app) {
            var server = app.listen(app.get('port'), function () {
                var request = supertest(app);
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
                    expect(res.body.test).toBe(1);
                    server.close(function () { return done(); });
                });
            });
        });
    });
});
