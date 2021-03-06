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
const producto_model_1 = require("../models/producto.model");
const convenio_model_1 = require("../models/convenio.model");
const buscadorRoutes = express_1.Router();
// Obtener producto por busqueda
buscadorRoutes.get("/:busqueda", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");
    const productos = yield producto_model_1.Producto.find({})
        .or([{ descripcion: regex }, { material: regex }])
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        productos,
    });
}));
// OBTENER EPP CONVENIO POR CODIGO
buscadorRoutes.get("/convenio-epp/:busqueda", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");
    const epps = yield convenio_model_1.Convenio.find({})
        .or([{ codigo: regex }, { epp: regex }])
        .sort({ epp: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        epps,
    });
}));
exports.default = buscadorRoutes;
