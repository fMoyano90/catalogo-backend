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
const autenticacion_1 = require("../middlewares/autenticacion");
const producto_model_1 = require("../models/producto.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const productoRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// OBTENER TODOS LOS PRODUCTOS PAGINADOS
productoRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const productos = yield producto_model_1.Producto.find()
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        productos
    });
}));
// OBTENER PRODUCTO POR ID
productoRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const producto = yield producto_model_1.Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: "No existe producto con esa ID",
                err
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    });
}));
// OBTENER PRODUCTOS POR CATEGORIA
productoRoutes.get("/categoria/:categoria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let params = req.params.categoria;
    let categoria = params.toString();
    console.log(categoria);
    const productos = yield producto_model_1.Producto.find({ categoria: categoria })
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        productos
    });
}));
// OBTENER PRODUCTOS POR GENERO
productoRoutes.get("/genero/:genero", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let params = req.params.genero;
    let genero = params.toString();
    console.log(genero);
    const productos = yield producto_model_1.Producto.find({ genero: genero })
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        productos
    });
}));
// CREAR PRODUCTO
productoRoutes.post("/", [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const imagen = fileSystem.imagenDeTempHaciaProducto();
    body.img = imagen;
    producto_model_1.Producto.create(body)
        .then((productoDB) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            ok: true,
            producto: productoDB
        });
    }))
        .catch(err => {
        res.json(err);
    });
}));
// EDITAR PRODUCTO
productoRoutes.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;
    const imagen = fileSystem.imagenDeTempHaciaProducto();
    body.img = imagen;
    producto_model_1.Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    });
});
// SERVICIO PARA SUBIR ARCHIVOS A STORAGE
productoRoutes.post("/upload", [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subió el archivo."
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subió el archivo - image"
        });
    }
    if (!file.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            mensaje: "El archivo no es una imagen"
        });
    }
    yield fileSystem.guardarImagenTemporal(file);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
// LLAMAR IMAGEN DESDE STORAGE
productoRoutes.get("/imagen/:img", (req, res) => {
    const img = req.params.img;
    const pathImage = fileSystem.getImageUrl(img);
    res.sendFile(pathImage);
});
// IMPORTAR CSV A BASE DE DATOS
productoRoutes.post("/leercsv", (req, res) => {
    const mongodb = require("mongodb").MongoClient;
    const csvtojson = require("csvtojson");
    const csvFilePath = "assets/productos1.csv";
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
                .collection("productos")
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
productoRoutes.post("/subir-imagen", (req, res) => {
    req.body;
});
exports.default = productoRoutes;
