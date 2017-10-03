"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var request = supertest("http://localhost:8000");
describe("GET /contact", function () {
    it("should return 200 OK", function (done) {
        request.get("/contact")
            .expect(200, done);
    });
});
