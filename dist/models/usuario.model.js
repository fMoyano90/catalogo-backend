"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    sap: {
        type: String,
        unique: true,
        required: [true, "El número de SAP es obligatorio"]
    },
    rut: {
        type: String,
        unique: true,
        required: [true, "El RUT es obligatorio"]
    },
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    genero: {
        type: String
    },
    estado_civil: {
        type: String
    },
    rol: {
        type: String
    },
    contrato: {
        type: String
    },
    aco: {
        type: String
    },
    nacimiento: {
        type: String
    },
    ingreso: {
        type: String
    },
    division: {
        type: String
    },
    centro_costo: {
        type: String
    },
    posicion: {
        type: String
    },
    div_pers: {
        type: String
    },
    funcion: {
        type: String
    },
    organizacion: {
        type: String
    },
    superintendencia: {
        type: String
    },
    gerencia: {
        type: String
    },
    regla_ppl: {
        type: String
    },
    previsiones: {
        type: String
    },
    salud: {
        type: String
    },
    calle: {
        type: String
    },
    villa: {
        type: String
    },
    ciudad: {
        type: String
    },
    comuna: {
        type: String
    },
    region: {
        type: String
    },
    tipo_socio: {
        type: String
    },
    tipo_usuario: {
        type: String,
        default: "USER"
    }
});
usuarioSchema.method("compararSap", function (sap = "") {
    if (bcrypt_1.default.compareSync(sap, this.sap)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model("Usuario", usuarioSchema);
