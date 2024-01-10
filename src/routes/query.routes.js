"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const query_manager_1 = __importDefault(require("../controllers/query.manager"));
class universityQueryManagerRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new query_manager_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/:name', this.controller.querySingle);
        this.router.get('/', this.controller.queryAll);
    }
}
exports.default = new universityQueryManagerRoutes().router;
