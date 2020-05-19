"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    codigo: { type: Number },
    epp: { type: String },
    salacom: { type: String },
    los_andes: { type: String },
    huechun: { type: String },
    saladillo: { type: String },
    planta_filtro: { type: String },
    hombre: { type: String },
    mujer: { type: String },
    verano: { type: String },
    invierno: { type: String },
    mecanico: { type: String },
    electrico: { type: String },
    general: { type: String },
    añoxmedio: { type: String },
    tipo: { type: String },
    talla: { type: String },
});
exports.Convenio = mongoose_1.model("Convenio", productoSchema);
