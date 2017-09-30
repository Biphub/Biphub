"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var server_1 = require("../../core/server");
var request = supertest('http://localhost:3000');
describe("POST /webhooks*", function () {
    beforeAll(function (done) {
        server_1.start().fork(function (e) { return console.error(e); }, function (app) {
            app.listen(app.get('port'), function () {
                done();
            });
        });
    });
    it("should return 200 OK", function (done) {
        request.post("/webhooks/test")
            .expect(200, done);
    });
    it("should return root webhooks", function (done) {
        request.post('/webhooks/test')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                return err;
            }
            console.log('checking! ', res.body.root);
            expect(res.body.root).toBe('webhooks');
        });
    });
});
