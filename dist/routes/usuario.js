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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
userRoutes.post("/login", (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ rut: body.rut }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "El número de RUT no figura en nuestros registros."
            });
        }
        if (userDB.compararSap(body.sap)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                sap: userDB.sap,
                rut: userDB.rut,
                tipo_usuario: userDB.tipo_usuario
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: "Número de SAP o RUT no son correctos"
            });
        }
    });
});
userRoutes.post("/create", (req, res) => {
    const user = {
        sap: req.body.sap,
        rut: req.body.rut,
        nombre: req.body.nombre,
        genero: req.body.genero,
        estado_civil: req.body.estado_civil,
        rol: req.body.rol,
        contrato: req.body.contrato,
        aco: req.body.aco,
        nacimiento: req.body.nacimiento,
        ingreso: req.body.ingreso,
        division: req.body.division,
        centro_costo: req.body.centro_costo,
        posicion: req.body.posicion,
        div_pers: req.body.div_pers,
        funcion: req.body.funcion,
        organizacion: req.body.organizacion,
        superintendencia: req.body.superintendencia,
        gerencia: req.body.gerencia,
        regla_ppl: req.body.regla_ppl,
        previsiones: req.body.previsiones,
        salud: req.body.salud,
        calle: req.body.calle,
        villa: req.body.villa,
        ciudad: req.body.ciudad,
        comuna: req.body.comuna,
        telefono: req.body.telefono,
        region: req.body.region,
        sindicato: req.body.sindicato,
        tipo_socio: req.body.tipo_socio,
        tipo_usuario: req.body.tipo_usuario
    };
    usuario_model_1.Usuario.create(user)
        .then(userDB => {
        res.json({
            ok: true,
            user: userDB
        });
    })
        .catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Actualizar usuario
userRoutes.post("/update", autenticacion_1.verificaToken, (req, res) => {
    const user = {
        sap: req.body.sap || req.usuario.sap,
        rut: req.body.rut || req.usuario.rut,
        nombre: req.body.nombre || req.usuario.nombre,
        genero: req.body.genero || req.usuario.genero,
        estado_civil: req.body.estado_civil || req.usuario.estado_civil,
        rol: req.body.rol || req.usuario.rol,
        contrato: req.body.contrato || req.usuario.contrato,
        aco: req.body.aco || req.usuario.aco,
        nacimiento: req.body.nacimiento || req.usuario.nacimiento,
        ingreso: req.body.ingreso || req.usuario.ingreso,
        division: req.body.division || req.usuario.division,
        centro_costo: req.body.centro_costo || req.usuario.centro_costo,
        posicion: req.body.posicion || req.usuario.posicion,
        div_pers: req.body.div_pers || req.usuario.div_pers,
        funcion: req.body.funcion || req.usuario.funcion,
        organizacion: req.body.organizacion || req.usuario.organizacion,
        superintendencia: req.body.superintendencia || req.usuario.superintendencia,
        gerencia: req.body.gerencia || req.usuario.gerencia,
        regla_ppl: req.body.regla_ppl || req.usuario.regla_ppl,
        previsiones: req.body.previsiones || req.usuario.previsiones,
        salud: req.body.salud || req.usuario.salud,
        calle: req.body.calle || req.usuario.calle,
        villa: req.body.villa || req.usuario.villa,
        ciudad: req.body.ciudad || req.usuario.ciudad,
        comuna: req.body.comuna || req.usuario.comuna,
        telefono: req.body.telefono || req.usuario.telefono,
        region: req.body.region || req.usuario.region,
        sindicato: req.body.sindicato || req.usuario.sindicato,
        tipo_socio: req.body.tipo_socio || req.usuario.tipo_socio,
        tipo_usuario: req.body.tipo_usuario || req.usuario.tipo_usuario
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "No existe un usuario con ese ID"
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            sap: userDB.sap,
            rut: userDB.rut,
            tipo_usuario: userDB.tipo_usuario
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
userRoutes.get("/", [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
// Obtener usuarios paginados
userRoutes.get("/all", [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const usuarios = yield usuario_model_1.Usuario.find()
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        usuarios
    });
}));
// IMPORTAR CSV A BASE DE DATOS
userRoutes.post("/leercsv", (req, res) => {
    const mongodb = require("mongodb").MongoClient;
    const csvtojson = require("csvtojson");
    const csvFilePath = "assets/usuarios.csv";
    // let url = "mongodb://username:password@localhost:27017/";
    let url = "mongodb://localhost:27017/";
    csvtojson({
        delimiter: [";"]
    })
        .fromFile(csvFilePath)
        .then((csvData) => {
        mongodb.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err)
                throw err;
            client
                .db("catalogo")
                .collection("users")
                .insertMany(csvData, (err, res) => {
                if (err)
                    throw err;
                console.log(`Inserted: ${res.insertedCount} rows`);
                client.close();
            });
        });
        res.json({
            status: 200,
            data: csvData
        });
    });
});
exports.default = userRoutes;
