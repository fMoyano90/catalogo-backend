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
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const convenio_model_1 = require("../models/convenio.model");
const convenioRoutes = express_1.Router();
// OBTENER EPPS CONVENIO POR TIPO
convenioRoutes.get("/convenio/:tipo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let params = req.params.tipo;
    let tipo = params.toString();
    console.log(tipo);
    const eppsConvenio = yield convenio_model_1.Convenio.find({ tipo: tipo });
    res.json({
        ok: true,
        pagina,
        eppsConvenio,
    });
}));
// CREAR EPP CONVENIO
convenioRoutes.post("/", [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    convenio_model_1.Convenio.create(body)
        .then((eppDB) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            ok: true,
            eppConvenio: eppDB,
        });
    }))
        .catch((err) => {
        res.json(err);
    });
}));
// IMPORTAR CSV A BASE DE DATOS (PRODUCTOS)
convenioRoutes.post("/leercsv", (req, res) => {
    const mongodb = require("mongodb").MongoClient;
    const csvtojson = require("csvtojson");
    const csvFilePath = "assets/epps-convenio.csv";
    // let url = "mongodb://username:password@localhost:27017/";
    let url = "mongodb://localhost:27017/";
    csvtojson({
        delimiter: [";"],
    })
        .fromFile(csvFilePath)
        .then((csvData) => {
        mongodb.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err)
                throw err;
            client
                .db("catalogo")
                .collection("convenios")
                .insertMany(csvData, (err, res) => {
                if (err)
                    throw err;
                console.log(`Inserted: ${res.insertedCount} rows`);
                client.close();
            });
        });
        res.json({
            status: 200,
            data: csvData,
        });
    });
});
exports.default = convenioRoutes;
