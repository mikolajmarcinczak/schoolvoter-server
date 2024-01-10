"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_routes_1 = __importDefault(require("./context.routes"));
const query_routes_1 = __importDefault(require("./query.routes"));
class Routes {
    constructor(app) {
        app.use("/api/context", context_routes_1.default);
        app.use("/api/query", query_routes_1.default);
    }
}
exports.default = Routes;
