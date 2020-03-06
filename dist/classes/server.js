"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.port = 3001;
        this.app = express_1.default();
    }
    start(callback) {
        this.app.listen(process.env.PORT || 3001, function () {
            console.log("Servidor corriendo en puerto 3001 o " + process.env.PORT);
        });
    }
}
exports.default = Server;
