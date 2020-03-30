import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Producto } from "../models/producto.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";

const productoRoutes = Router();
const fileSystem = new FileSystem();

// OBTENER TODOS LOS PRODUCTOS PAGINADOS
productoRoutes.get("/", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  const productos = await Producto.find()
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    productos
  });
});

// OBTENER PRODUCTO POR ID
productoRoutes.get("/:id", async (req: any, res: Response) => {
  let id = req.params.id;
  const producto = await Producto.findById(id, (err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        message: "No existe producto con esa ID",
        err
      });
    }

    res.json({
      ok: true,
      producto: productoBD
    });
  });
});

// OBTENER PRODUCTOS POR CATEGORIA
productoRoutes.get("/categoria/:categoria", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  let params = req.params.categoria;
  let categoria = params.toString();

  console.log(categoria);

  const productos = await Producto.find({ categoria: categoria })
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    productos
  });
});

// OBTENER PRODUCTOS POR GENERO
productoRoutes.get("/genero/:genero", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  let params = req.params.genero;
  let genero = params.toString();

  console.log(genero);

  const productos = await Producto.find({ genero: genero })
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    productos
  });
});

// CREAR PRODUCTO
productoRoutes.post("/", [verificaToken], async (req: any, res: Response) => {
  let body = req.body;

  const imagen = fileSystem.imagenDeTempHaciaProducto();
  body.img = imagen;
  Producto.create(body)
    .then(async productoDB => {
      res.json({
        ok: true,
        producto: productoDB,
        nombreImagen: imagen
      });
    })
    .catch(err => {
      res.json(err);
    });
});

// EDITAR PRODUCTO
productoRoutes.put("/:id", (req: any, res: Response) => {
  let id = req.params.id;
  let body = req.body;
  const imagen = fileSystem.imagenDeTempHaciaProducto();
  body.img = imagen;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoBD
      });
    }
  );
});

// SERVICIO PARA SUBIR ARCHIVOS A STORAGE
productoRoutes.post(
  "/upload",
  [verificaToken],
  async (req: any, res: Response) => {
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        mensaje: "No se subió el archivo."
      });
    }

    const file: FileUpload = req.files.image;

    if (!file) {
      return res.status(400).json({
        ok: false,
        mensaje: "No se subió el archivo - image"
      });
    }

    if (!file.mimetype.includes("image")) {
      return res.status(400).json({
        ok: false,
        mensaje: "El archivo no es una imagen"
      });
    }

    await fileSystem.guardarImagenTemporal(file);

    res.json({
      ok: true,
      file: file.mimetype
    });
  }
);

// LLAMAR IMAGEN DESDE STORAGE
productoRoutes.get("/imagen/:img", (req: any, res: Response) => {
  const img = req.params.img;
  const pathImage = fileSystem.getImageUrl(img);

  res.sendFile(pathImage);
});

// IMPORTAR CSV A BASE DE DATOS (PRODUCTOS)
productoRoutes.post("/leercsv", (req: any, res: any) => {
  const mongodb = require("mongodb").MongoClient;
  const csvtojson = require("csvtojson");
  const csvFilePath = "assets/productos1.csv";

  // let url = "mongodb://username:password@localhost:27017/";
  let url = "mongodb://localhost:27017/";

  csvtojson({
    delimiter: [";"]
  })
    .fromFile(csvFilePath)
    .then((csvData: any) => {
      mongodb.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err: any, client: any) => {
          if (err) throw err;
          client
            .db("catalogo")
            .collection("productos")
            .insertMany(csvData, (err: any, res: any) => {
              if (err) throw err;
              console.log(`Inserted: ${res.insertedCount} rows`);
              client.close();
            });
        }
      );
      res.json({
        status: 200,
        data: csvData
      });
    });
});

// IMPORTAR CSV A BASE DE DATOS
productoRoutes.post("/leercsv2", (req: any, res: any) => {
  const mongodb = require("mongodb").MongoClient;
  const csvtojson = require("csvtojson");
  const csvFilePath = "assets/usuarios.csv";

  // let url = "mongodb://username:password@localhost:27017/";
  let url = "mongodb://localhost:27017/";

  csvtojson({
    delimiter: [";"]
  })
    .fromFile(csvFilePath)
    .then((csvData: any) => {
      mongodb.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err: any, client: any) => {
          if (err) throw err;
          client
            .db("catalogo")
            .collection("usuarios")
            .insertMany(csvData, (err: any, res: any) => {
              if (err) throw err;
              console.log(`Inserted: ${res.insertedCount} rows`);
              client.close();
            });
        }
      );
      res.json({
        status: 200,
        data: csvData
      });
    });
});

productoRoutes.post("/subir-imagen", (req, res) => {
  req.body;
});

export default productoRoutes;
