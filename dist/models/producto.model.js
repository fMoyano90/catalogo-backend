"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    material: {
        type: String,
    },
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    categoria: {
        type: String,
    },
    genero: {
        type: String,
    },
    medida: {
        type: String,
    },
    img: [
        {
            type: String,
        },
    ],
    created: {
        type: Date,
    },
});
productoSchema.pre("save", function (next) {
    this.created = new Date();
    next();
});
exports.Producto = mongoose_1.model("Producto", productoSchema);
