"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env = (process.env.NODE_ENV || 'production');
const API_PORT = 8081;
exports.config = {
    env,
    server: {
        port: API_PORT,
        corsOptions: env === 'development' ? { origin: 'localhost:' + API_PORT } : {},
        limiter: {
            time: 15 * 60 * 1000,
            max: 250
        }
    }
};
