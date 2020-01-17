import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  guardarImagenTemporal(file: FileUpload) {
    return new Promise((resolve, reject) => {
      // Crear carpetas
      const path = this.crearCarpetaImagen();
      // Nombre del archivo
      const nombreArchivo = this.generarNombreUnico(file.name);
      // Mover el archivo del Temp a carpeta
      file.mv(`${path}/${nombreArchivo}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private generarNombreUnico(nombreOriginal: string) {
    const nombreArr = nombreOriginal.split(".");
    const extension = nombreArr[nombreArr.length - 1];

    const idUnico = uniqid();

    return `${idUnico}.${extension}`;
  }

  private crearCarpetaImagen() {
    const pathImage = path.resolve(__dirname, "../uploads");
    const pathImageTemp = pathImage + "/temp";

    // console.log(pathImage);

    const existe = fs.existsSync(pathImage);

    if (!existe) {
      fs.mkdirSync(pathImage);
      fs.mkdirSync(pathImageTemp);
    }
    return pathImageTemp;
  }

  imagenDeTempHaciaProducto() {
    const pathImageTemp = path.resolve(__dirname, "../uploads/temp");
    const pathImageProducto = path.resolve(__dirname, "../uploads/productos");

    if (!fs.existsSync(pathImageTemp)) {
      return [];
    }
    if (!fs.existsSync(pathImageProducto)) {
      fs.mkdirSync(pathImageProducto);
    }

    const imagenTemp = this.obtenerImagenEnTemp();

    imagenTemp.forEach(imagen => {
      fs.renameSync(
        `${pathImageTemp}/${imagen}`,
        `${pathImageProducto}/${imagen}`
      );
    });
    return imagenTemp;
  }

  private obtenerImagenEnTemp() {
    const pathImageTemp = path.resolve(__dirname, "../uploads/temp");
    return fs.readdirSync(pathImageTemp) || [];
  }

  getImageUrl(img: any) {
    // Path Producto
    const pathImg = path.resolve(__dirname, "../uploads/productos", img);

    const existe = fs.existsSync(pathImg);
    if (!existe) {
      return path.resolve(__dirname, "../assets/400x250.jpg");
    }

    return pathImg;
  }
}
