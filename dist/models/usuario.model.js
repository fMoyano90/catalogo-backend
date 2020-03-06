"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    avatar: {
        type: String,
        default: "av-1.png"
    },
    role: {
        type: String,
        default: "USER"
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"]
    },
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
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    }
});
usuarioSchema.method("compararPassword", function (password = "") {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model("Usuario", usuarioSchema);
