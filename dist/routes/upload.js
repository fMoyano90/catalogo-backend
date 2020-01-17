"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = express_1.default();
// defaukt options 
app.use(express_fileupload_1.default({ useTempFiles: true }));
app.put('/upload', function (req, res) {
    if (!req.files) {
        return res.status(400)
            .json({
            ok: false,
            err: {
                message: 'No hay archivos que subir.'
            }
        });
    }
    let imagen = req.files.image;
    imagen.mv('/uploads/filename.png', (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Imagen subida exitosamente'
        });
    });
});
