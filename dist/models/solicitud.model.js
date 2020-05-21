"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const solicitudSchema = new mongoose_1.Schema({
    usuarioID: {
        type: String,
        required: [true, "El id del usuario es obligatorio"],
    },
    nombre: { type: String },
    rut: { type: String },
    sap: { type: String },
    funcion: { type: String },
    ubicacion: { type: String },
    centro_costo: { type: String },
    lugar_retiro: { type: String },
    epps: { type: [] },
    temporada: { type: String },
    mes: { type: Number },
    anio: { type: Number },
});
exports.Solicitud = mongoose_1.model("Solicitud", solicitudSchema);
