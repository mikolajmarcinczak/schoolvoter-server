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
const hkeysAsync = (0, util_1.promisify)(database_1.client.HKEYS).bind(database_1.client);
class QueryManager {
    querySingle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.query;
                if (name === "") {
                    return res.status(400).send({ message: "Bad request." });
                }
                const university = yield hgetallAsync(name);
                if (!university) {
                    return res.status(404).send({ message: `${name} not found.` });
                }
                return res.status(200).send({ message: `${name} retrieved successfully.`, university });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal server error." });
            }
        });
    }
    queryAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const universities = yield hkeysAsync('*');
                const result = [];
                for (let university of universities) {
                    const data = yield hgetallAsync(university);
                    if (university)
                        result.push(data);
                }
                return res.status(200).send({ message: "Universities retrieved successfully.", universities: result });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal server error." });
            }
        });
    }
}
exports.default = QueryManager;
