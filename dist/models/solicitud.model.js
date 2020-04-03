"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const solicitudSchema = new mongoose_1.Schema({
    usuarioID: {
        type: String,
        required: [true, "El id del usuario es obligatorio"]
    },
    nombre: { type: String },
    rut: { type: String },
    sap: { type: String },
    funcion: { type: String },
    ubicación: { type: String },
    periodo: { type: String },
    epp1: { type: String },
    tall1: { type: String },
    epp2: { type: String },
    tall2: { type: String },
    epp3: { type: String },
    tall3: { type: String },
    epp4: { type: String },
    tall4: { type: String },
    epp5: { type: String },
    tall5: { type: String },
    epp6: { type: String },
    tall6: { type: String },
    epp7: { type: String },
    tall7: { type: String },
    epp8: { type: String },
    tall8: { type: String },
    epp9: { type: String },
    tall9: { type: String },
    epp10: { type: String },
    tall10: { type: String },
    epp11: { type: String },
    tall11: { type: String },
    epp12: { type: String },
    tall12: { type: String },
    epp13: { type: String },
    tall13: { type: String },
    epp14: { type: String },
    tall14: { type: String },
    epp15: { type: String },
    tall15: { type: String },
    temporada: { type: String },
    anio: { type: Date },
    mes: { type: Date }
});
exports.Solicitud = mongoose_1.model("Solicitud", solicitudSchema);
