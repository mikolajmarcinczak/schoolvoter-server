"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utility/database");
const util_1 = require("util");
const hgetallAsync = (0, util_1.promisify)(database_1.client.HGETALL).bind(database_1.client);
const hsetAsync = (0, util_1.promisify)(database_1.client.HSET).bind(database_1.client);
class ContextManager {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, type, miasto } = req.body;
                if (name === "" || type === "" || miasto === "") {
                    return res.status(400).send({ message: "Bad request." });
                }
                const exists = yield hgetallAsync(name);
                if (exists) {
                    return res.status(409).send({ message: `${name} already exists.` });
                }
                yield hsetAsync(name, "type", type, "miasto", miasto, "score", 0, "votes", 0);
                return res.status(201).send({ message: `Successfully added ${name}.` });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal server error." });
            }
        });
    }
    updateScore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, newScore } = req.body;
                if (name === "" || newScore === "") {
                    return res.status(400).send({ message: "Bad request." });
                }
                const university = yield hgetallAsync(name);
                if (!university) {
                    return res.status(404).send({ message: `${name} not found.` });
                }
                const currentScore = parseFloat(university.score || '0');
                const currentCount = parseInt(university.votes || '0');
                const updatedScore = (currentScore * currentCount + newScore) / (currentCount + 1);
                yield hsetAsync(name, "score", updatedScore.toString(), "votes", (currentCount + 1).toString());
                return res.status(200).send({ message: `${name} updated successfully.`, score: updatedScore });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal server error." });
            }
        });
    }
}
exports.default = ContextManager;
