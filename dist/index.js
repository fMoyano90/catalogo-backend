"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// RUTAS
const usuario_1 = __importDefault(require("./routes/usuario"));
const producto_1 = __importDefault(require("./routes/producto"));
const buscador_1 = __importDefault(require("./routes/buscador"));
const server = new server_1.default();
// Configurar cabeceras y cors
server.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, x-token, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// File Upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Rutas de mi appnpm install @types/express-fileupload
server.app.use("/user", usuario_1.default);
server.app.use("/productos", producto_1.default);
server.app.use("/buscador", buscador_1.default);
// Conectar DB
mongoose_1.default.connect("mongodb://localhost:27017/catalogo", 
// "mongodb+srv://HitCode:HITCODE4716@catalogoepp-4kv0t.mongodb.net/test?retryWrites=true&w=majority",
{ useNewUrlParser: true, useCreateIndex: true }, err => {
    if (err)
        throw err;
    console.log("Base de datos ONLINE");
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
