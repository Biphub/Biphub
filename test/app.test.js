"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var request = supertest("http://localhost:8000");
describe("GET /random-url", function () {
    it("should return 404", function (done) {
        request.get("/reset")
            .expect(404, done);
    });
});
