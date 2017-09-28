"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var node2node_1 = require("../../../core/bridge/node2node");
describe("Node2Node bridge", function () {
    it('must return any json', function () {
        var result = node2node_1.getAllManifests();
        expect(result).not.toBe(null);
        expect(result).not.toBe([]);
    });
    it('each manifest must contain name, title, desc, url', function () {
        var results = node2node_1.getAllManifests();
        R.forEach(function (man) {
            expect(man.title).toBeDefined();
            expect(man.name).toBeDefined();
            expect(man.description).toBeDefined();
            expect(man.url).toBeDefined();
        }, results);
    });
});
