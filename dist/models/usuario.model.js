"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usuarioSchema = new mongoose_1.Schema({
    sap: {
        type: Number,
        unique: true,
        required: [true, "El número de SAP es obligatorio"],
    },
    rut: {
        type: String,
        unique: true,
        required: [true, "El RUT es obligatorio"],
    },
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    genero: {
        type: String,
    },
    centro_costo: {
        type: String,
    },
    ubicacion: {
        type: String,
    },
    cargo: {
        type: String,
    },
    tipo_usuario: {
        type: String,
        default: "USER",
    },
});
usuarioSchema.method("compararSap", function (sap = 0) {
    if (sap == this.sap) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model("Usuario", usuarioSchema);
