"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const context_manager_1 = __importDefault(require("../controllers/context.manager"));
class universityContextManagerRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new context_manager_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', this.controller.create);
        this.router.put('/:name', this.controller.updateScore);
    }
}
exports.default = new universityContextManagerRoutes().router;
