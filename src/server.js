"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./utility/config");
const server_model_1 = __importDefault(require("./model/server.model"));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const startServer = (configuration) => {
    const app = (0, express_1.default)();
    const server = new server_model_1.default(app, configuration);
    app.listen(configuration.port, "localhost", () => {
        console.log(`Server listening on port ${configuration.port}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log("ERROR: address already in use, retry...");
        }
        else {
            console.log(err);
        }
    });
};
startServer(config_1.config.server);
