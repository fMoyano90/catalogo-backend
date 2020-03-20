"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    guardarImagenTemporal(file) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.crearCarpetaImagen();
            // Nombre del archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            // Mover el archivo del Temp a carpeta
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split(".");
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaImagen() {
        const pathImage = path_1.default.resolve("dist/uploads");
        const pathImageTemp = pathImage + "/temp";
        console.log(pathImageTemp);
        const existe = fs_1.default.existsSync(pathImage);
        if (!existe) {
            fs_1.default.mkdirSync(pathImage);
            fs_1.default.mkdirSync(pathImageTemp);
        }
        return pathImageTemp;
    }
    imagenDeTempHaciaProducto() {
        const pathImageTemp = path_1.default.resolve(__dirname, "../uploads/temp");
        const pathImageProducto = path_1.default.resolve(__dirname, "../uploads/productos");
        if (!fs_1.default.existsSync(pathImageTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathImageProducto)) {
            fs_1.default.mkdirSync(pathImageProducto);
        }
        const imagenTemp = this.obtenerImagenEnTemp();
        imagenTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathImageTemp}/${imagen}`, `${pathImageProducto}/${imagen}`);
        });
        return imagenTemp;
    }
    obtenerImagenEnTemp() {
        const pathImageTemp = path_1.default.resolve(__dirname, "../uploads/temp");
        return fs_1.default.readdirSync(pathImageTemp) || [];
    }
    getImageUrl(img) {
        // Path Producto
        const pathImg = path_1.default.resolve(__dirname, "../uploads/productos", img);
        const existe = fs_1.default.existsSync(pathImg);
        if (!existe) {
            return path_1.default.resolve(__dirname, "../assets/400x250.jpg");
        }
        return pathImg;
    }
}
exports.default = FileSystem;
