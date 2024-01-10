"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("../routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
class Server {
    constructor(app, configuration) {
        this.configuration = configuration;
        this.config(app);
        new routes_1.default(app);
    }
    config(app) {
        let time = this.configuration.limiter.time;
        let max = this.configuration.limiter.max;
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)(this.configuration.corsOptions));
        app.use((0, express_rate_limit_1.default)({ windowMs: time, max: max }));
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.disable('x-powered-by');
    }
}
exports.default = Server;
