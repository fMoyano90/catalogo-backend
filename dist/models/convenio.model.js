"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    codigo: { type: Number },
    epp: { type: String },
    salacom: { type: Boolean },
    los_andes: { type: Boolean },
    huechun: { type: Boolean },
    saladillo: { type: Boolean },
    planta_filtro: { type: Boolean },
    hombre: { type: Boolean },
    mujer: { type: Boolean },
    verano: { type: Boolean },
    invierno: { type: Boolean },
    mecanico: { type: Boolean },
    electrico: { type: Boolean },
    general: { type: Boolean },
    añoxmedio: { type: Boolean },
    tipo: { type: String },
    talla: { type: String },
});
exports.Convenio = mongoose_1.model("Convenio", productoSchema);
